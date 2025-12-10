import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./src/config/env.js";
import analysisRoutes from "./src/routes/analysis.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import { errorHandler, notFoundHandler } from "./src/utils/http.js";

const app = express();
const allowedOrigins = new Set([config.clientUrl, "http://localhost:5173"]);

app.set("trust proxy", 1);
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AdsPulse API",
    environment: config.nodeEnv,
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/reports", reportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

