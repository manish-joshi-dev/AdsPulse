import { analyzeUploadedCsv } from "../services/analysis.service.js";
import { removeFile } from "../utils/cleanup.js";
import { ApiError } from "../utils/http.js";

export const uploadCsv = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "CSV file is required");
  }

  const userId = req.user?.id || null;
  const payload = {
    filePath: req.file.path,
    originalName: req.file.originalname,
    userId
  };

  if (req.query.async === "true") {
    const queue = req.app.locals.analysisQueue;
    if (!queue) {
      await removeFile(req.file.path);
      throw new ApiError(
        503,
        "Async analysis jobs require UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN or REDIS_URL"
      );
    }

    const job = await queue.add(payload);
    res.status(202).json({
      status: "queued",
      jobId: String(job.id)
    });
    return;
  }

  try {
    const report = await analyzeUploadedCsv(payload);
    res.status(201).json({
      status: "completed",
      report
    });
  } finally {
    await removeFile(req.file.path);
  }
};

export const getUploadJob = async (req, res) => {
  const queue = req.app.locals.analysisQueue;
  if (!queue) {
    throw new ApiError(503, "Async analysis jobs require REDIS_URL");
  }

  const job = await queue.getJob(req.params.jobId);
  if (!job) {
    throw new ApiError(404, "Analysis job was not found");
  }

  const state = await job.getState();
  const progress = await Promise.resolve(job.progress());
  res.json({
    id: String(job.id),
    state,
    progress,
    failedReason: job.failedReason || null,
    result: job.returnvalue || null
  });
};
