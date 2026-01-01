import { v4 as uuidv4 } from "uuid";
import { isDatabaseConnected } from "../config/database.js";
import AnalysisJob from "../models/AnalysisJob.model.js";
import { analyzeUploadedCsv } from "../services/analysis.service.js";
import { deleteUploadedFile } from "../utils/fileCleanup.util.js";
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
      await deleteUploadedFile(req.file.path);
      throw new ApiError(
        503,
        "Async analysis jobs require REDIS_URL with an Upstash Redis rediss:// endpoint"
      );
    }

    if (!userId) {
      await deleteUploadedFile(req.file.path);
      throw new ApiError(401, "Async analysis requires an authenticated user");
    }

    if (!isDatabaseConnected()) {
      await deleteUploadedFile(req.file.path);
      throw new ApiError(503, "Async analysis requires MongoDB");
    }

    const jobId = uuidv4();

    try {
      const analysisJob = await AnalysisJob.create({
        jobId,
        userId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        status: "queued",
        progress: 0
      });

      const job = await queue.add(
        "process-analysis",
        {
          ...payload,
          jobId,
          fileName: req.file.originalname
        },
        { jobId }
      );

      res.status(202).json({
        status: "queued",
        jobId,
        queueJobId: String(job.id),
        analysisJobId: analysisJob.id
      });
    } catch (error) {
      await deleteUploadedFile(req.file.path);
      throw error;
    }
    return;
  }

  try {
    const report = await analyzeUploadedCsv(payload);
    res.status(201).json({
      status: "completed",
      report
    });
  } finally {
    await deleteUploadedFile(req.file.path);
  }
};

export const getUploadJob = async (req, res) => {
  const queue = req.app.locals.analysisQueue;
  if (!queue) {
    throw new ApiError(
      503,
      "Async analysis jobs require REDIS_URL with an Upstash Redis rediss:// endpoint"
    );
  }

  const job = await queue.getJob(req.params.jobId);
  const analysisJob = await AnalysisJob.findByJobId(req.params.jobId);

  if (!job && !analysisJob) {
    throw new ApiError(404, "Analysis job was not found");
  }

  const state = analysisJob?.status || (job ? await job.getState() : "unknown");
  const progress = analysisJob?.progress ?? job?.progress ?? 0;

  res.json({
    id: req.params.jobId,
    queueJobId: job ? String(job.id) : null,
    analysisJobId: analysisJob?.id || null,
    state,
    progress,
    failedReason: analysisJob?.errorMessage || job?.failedReason || null,
    result: job?.returnvalue || null,
    analysis: analysisJob || null
  });
};
