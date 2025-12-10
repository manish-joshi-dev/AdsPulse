import { Router } from "express";
import { param } from "express-validator";
import {
  deleteReport,
  getReport,
  getReportSummary,
  listReportHistory
} from "../controllers/reports.controller.js";
import { optionalAuthenticate } from "../utils/authMiddleware.js";
import { asyncHandler, validateRequest } from "../utils/http.js";

const router = Router();

router.get("/", optionalAuthenticate, asyncHandler(listReportHistory));
router.get("/summary", optionalAuthenticate, asyncHandler(getReportSummary));
router.get(
  "/:id",
  optionalAuthenticate,
  [param("id").trim().notEmpty().withMessage("Report id is required")],
  validateRequest,
  asyncHandler(getReport)
);
router.delete(
  "/:id",
  optionalAuthenticate,
  [param("id").trim().notEmpty().withMessage("Report id is required")],
  validateRequest,
  asyncHandler(deleteReport)
);

export default router;

