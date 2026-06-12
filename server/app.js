import express from "express";
import morgan from "morgan";
import { config } from "./src/config/env.js";
import { applySecurity } from "./src/config/security.config.js";
import { sanitizeInput } from "./src/middleware/validation.middleware.js";
import { uploadRateLimit, analysisRateLimit, authRateLimit } from "./src/middleware/rateLimit.middleware.js";
import { errorHandler } from "./src/middleware/errorHandler.middleware.js";
import analysisRoutes from "./src/routes/analysis.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import reportsRoutes from "./src/routes/reports.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
const app = express();

applySecurity(app);
app.use(express.json({ limit: "2mb" }));
app.use(sanitizeInput);

app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AdsPulse API",
    environment: config.nodeEnv,
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRateLimit, authRoutes);
app.use("/api/upload", uploadRateLimit, uploadRoutes);
app.use("/api/analysis", analysisRateLimit, analysisRoutes);
app.use("/api/reports", reportsRoutes);

app.use(errorHandler);
export default app;

