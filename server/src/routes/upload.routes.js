import path from "node:path";
import { Router } from "express";
import { body } from "express-validator";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { uploadCsv } from "../controllers/upload.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

const uploadsDir = path.resolve(process.cwd(), "uploads");

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, callback) => {
    callback(null, `${uuidv4()}-${Date.now()}.csv`);
  }
});

const csvFileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension !== ".csv") {
    return callback(new Error("Only CSV files are allowed."));
  }

  return callback(null, true);
};

const upload = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

router.post(
  "/csv",
  authenticate,
  upload.single("file"),
  [
    body("file").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("CSV file is required.");
      }

      return true;
    })
  ],
  uploadCsv
);

export default router;
