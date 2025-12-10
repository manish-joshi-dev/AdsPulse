import { Router } from "express";
import { param } from "express-validator";
import {
  getAnalysis,
  getLatestAnalysis,
  listAnalyses
} from "../controllers/analysis.controller.js";
import { optionalAuthenticate } from "../utils/authMiddleware.js";
import { asyncHandler, validateRequest } from "../utils/http.js";

const router = Router();

router.get("/", optionalAuthenticate, asyncHandler(listAnalyses));
router.get("/latest", optionalAuthenticate, asyncHandler(getLatestAnalysis));
router.get(
  "/:id",
  optionalAuthenticate,
  [param("id").trim().notEmpty().withMessage("Analysis id is required")],
  validateRequest,
  asyncHandler(getAnalysis)
);

export default router;

