import app from "./app.js";
import { config } from "./src/config/env.js";
import { connectDatabase, disconnectDatabase } from "./src/config/database.js";
import { connectRedis, disconnectRedis } from "./src/config/redis.js";
import { createAnalysisQueue, startAnalysisWorker } from "./src/workers/analysis.worker.js";

const startServer = async () => {
  const database = await connectDatabase();
  const redis = await connectRedis();
  const analysisQueue = createAnalysisQueue(redis);

  if (analysisQueue) {
    startAnalysisWorker(analysisQueue);
  }

  app.locals.database = database;
  app.locals.redis = redis;
  app.locals.analysisQueue = analysisQueue;

  const server = app.listen(config.port, () => {
    console.log(`AdsPulse API listening on port ${config.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Closing AdsPulse API.`);
    server.close(async () => {
      if (analysisQueue) {
        await analysisQueue.close();
      }
      await disconnectRedis();
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

startServer().catch((error) => {
  console.error("Failed to start AdsPulse API", error);
  process.exit(1);
});
