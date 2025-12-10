import { Router } from "express";
import { body } from "express-validator";
import { login, me, register } from "../controllers/auth.controller.js";
import { authenticate } from "../utils/authMiddleware.js";
import { asyncHandler, validateRequest } from "../utils/http.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
  ],
  validateRequest,
  asyncHandler(register)
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("A valid email is required").normalizeEmail(),
    body("password").isString().notEmpty().withMessage("Password is required")
  ],
  validateRequest,
  asyncHandler(login)
);

router.get("/me", authenticate, asyncHandler(me));

export default router;

