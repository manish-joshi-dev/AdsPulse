import { EventEmitter } from "events";
import Queue from "bull";
import { v4 as uuidv4 } from "uuid";
import { config } from "../config/env.js";
import { analyzeUploadedCsv } from "../services/analysis.service.js";
import { removeFile } from "../utils/cleanup.js";

const queueKey = "adspulse:analysis:queue";
const jobKey = (id) => `adspulse:analysis:jobs:${id}`;
const jobTtlSeconds = 60 * 60 * 24 * 7;

const parseStoredJob = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return JSON.parse(value);
  }

  return value;
};

class UpstashAnalysisJob {
  constructor(queue, record) {
    this.queue = queue;
    this.record = record;
    this.id = record.id;
    this.data = record.data;
    this.failedReason = record.failedReason || null;
    this.returnvalue = record.result || null;
  }

  async getState() {
    const latest = await this.queue.readJob(this.id);
    return latest?.state || "unknown";
  }

  async progress(value) {
    if (value === undefined) {
      const latest = await this.queue.readJob(this.id);
      return latest?.progress || 0;
    }

    await this.queue.updateJob(this.id, {
      progress: value
    });
    this.record.progress = value;
    return value;
  }
}

class UpstashAnalysisQueue extends EventEmitter {
  constructor(redis) {
    super();
    this.redis = redis;
    this.closed = false;
    this.pollTimer = null;
    this.activeCount = 0;
  }

  async add(data) {
    const now = new Date().toISOString();
    const record = {
      id: uuidv4(),
      state: "queued",
      progress: 0,
      data,
      result: null,
      failedReason: null,
      createdAt: now,
      updatedAt: now
    };

    await this.writeJob(record);
    await this.redis.rpush(queueKey, record.id);
    return new UpstashAnalysisJob(this, record);
  }

  async getJob(id) {
    const record = await this.readJob(id);
    return record ? new UpstashAnalysisJob(this, record) : null;
  }

  async readJob(id) {
    const value = await this.redis.get(jobKey(id));
    return parseStoredJob(value);
  }

  async writeJob(record) {
    await this.redis.set(jobKey(record.id), JSON.stringify(record), {
      ex: jobTtlSeconds
    });
  }

  async updateJob(id, changes) {
    const record = await this.readJob(id);
    if (!record) {
      return null;
    }

    const updated = {
      ...record,
      ...changes,
      updatedAt: new Date().toISOString()
    };
    await this.writeJob(updated);
    return updated;
  }

  process(concurrency, handler) {
    const poll = async () => {
      if (this.closed) {
        return;
      }

      while (this.activeCount < concurrency) {
        const id = await this.redis.lpop(queueKey);
        if (!id) {
          return;
        }

        this.activeCount += 1;
        this.runJob(String(id), handler).finally(() => {
          this.activeCount -= 1;
        });
      }
    };

    this.pollTimer = setInterval(() => {
      poll().catch((error) => this.emit("error", error));
    }, 1000);
    poll().catch((error) => this.emit("error", error));
  }

  async runJob(id, handler) {
    const record = await this.updateJob(id, {
      state: "active",
      progress: 1
    });

    if (!record) {
      return;
    }

    const job = new UpstashAnalysisJob(this, record);

    try {
      const result = await handler(job);
      job.returnvalue = result;
      await this.updateJob(id, {
        state: "completed",
        progress: 100,
        result,
        failedReason: null
      });
      this.emit("completed", job, result);
    } catch (error) {
      job.failedReason = error.message;
      await this.updateJob(id, {
        state: "failed",
        failedReason: error.message
      });
      this.emit("failed", job, error);
    }
  }

  async close() {
    this.closed = true;
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
}

export const createAnalysisQueue = (redisConnection = null) => {
  if (redisConnection?.provider === "upstash-rest") {
    return new UpstashAnalysisQueue(redisConnection.client);
  }

  if (!config.redisUrl) {
    return null;
  }

  return new Queue("adspulse-analysis", config.redisUrl, {
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 5000
      },
      removeOnComplete: 50,
      removeOnFail: 100
    }
  });
};

export const startAnalysisWorker = (queue) => {
  queue.process(2, async (job) => {
    await job.progress(10);
    try {
      const report = await analyzeUploadedCsv(job.data);
      await job.progress(100);
      return {
        reportId: report.id,
        score: report.performanceScore,
        grade: report.grade
      };
    } finally {
      await removeFile(job.data.filePath);
    }
  });

  queue.on("completed", (job, result) => {
    console.log(`Analysis job ${job.id} completed with report ${result.reportId}`);
  });

  queue.on("failed", (job, error) => {
    console.error(`Analysis job ${job?.id || "unknown"} failed: ${error.message}`);
  });
};
