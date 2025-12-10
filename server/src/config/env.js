import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const upstashRedisRestUrl =
  process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || "";
const upstashRedisRestToken =
  process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "";
const redisUrl = process.env.REDIS_URL || "";
const redisProvider =
  upstashRedisRestUrl && upstashRedisRestToken
    ? "upstash-rest"
    : redisUrl
      ? "redis-tcp"
      : "disabled";

if (nodeEnv === "production") {
  const requiredInProduction = ["JWT_SECRET", "MONGODB_URI"];
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (redisProvider === "disabled") {
    missing.push("UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN or REDIS_URL");
  }
  if (missing.length > 0) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}

export const config = {
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  mongodbUri: process.env.MONGODB_URI || "",
  redisUrl,
  upstashRedisRestUrl,
  upstashRedisRestToken,
  redisProvider,
  port: Number(process.env.PORT || 5000),
  nodeEnv,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtSecret:
    process.env.JWT_SECRET ||
    "development-only-secret-change-before-deployment"
};
