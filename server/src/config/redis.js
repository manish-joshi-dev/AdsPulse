import { Redis as UpstashRedis } from "@upstash/redis";
import Redis from "ioredis";
import { config } from "./env.js";

let redisClient = null;
let redisProvider = "disabled";

export const connectRedis = async () => {
  if (config.redisProvider === "upstash-rest") {
    try {
      redisClient = new UpstashRedis({
        url: config.upstashRedisRestUrl,
        token: config.upstashRedisRestToken
      });
      await redisClient.ping();
      redisProvider = "upstash-rest";
      console.log("Upstash Redis connected via REST");
      return {
        provider: redisProvider,
        client: redisClient
      };
    } catch (error) {
      redisClient = null;
      if (config.nodeEnv === "production") {
        throw error;
      }
      console.warn(`Upstash Redis connection failed. Async analysis jobs are disabled: ${error.message}`);
      return null;
    }
  }

  if (config.redisProvider === "disabled") {
    console.warn("Redis credentials are not set. Async analysis jobs are disabled for this process.");
    return null;
  }

  try {
    redisClient = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
      lazyConnect: true
    });

    await redisClient.connect();
    await redisClient.ping();
    redisProvider = "redis-tcp";
    console.log("Redis connected via TCP");
    return {
      provider: redisProvider,
      client: redisClient
    };
  } catch (error) {
    if (redisClient) {
      redisClient.disconnect();
      redisClient = null;
    }
    if (config.nodeEnv === "production") {
      throw error;
    }
    console.warn(`Redis TCP connection failed. Async analysis jobs are disabled: ${error.message}`);
    return null;
  }
};

export const disconnectRedis = async () => {
  if (redisClient) {
    if (redisProvider === "redis-tcp") {
      await redisClient.quit();
    }
    redisClient = null;
    redisProvider = "disabled";
    console.log("Redis disconnected");
  }
};
