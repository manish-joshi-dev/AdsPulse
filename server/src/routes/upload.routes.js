import { Router } from "express";
import { param } from "express-validator";
import { getUploadJob, uploadCsv } from "../controllers/upload.controller.js";
import { optionalAuthenticate } from "../utils/authMiddleware.js";
import { csvUpload } from "../utils/fileUpload.js";
import { asyncHandler, validateRequest } from "../utils/http.js";

const router = Router();

router.post("/", optionalAuthenticate, csvUpload.single("file"), asyncHandler(uploadCsv));

router.get(
  "/jobs/:jobId",
  [param("jobId").trim().notEmpty().withMessage("Job id is required")],
  validateRequest,
  asyncHandler(getUploadJob)
);

export default router;

