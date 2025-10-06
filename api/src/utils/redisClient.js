import Redis from "ioredis";

const redisURL = process.env.REDIS_URL || "redis://redis:6379";
export const redis = new Redis(redisURL);

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err));