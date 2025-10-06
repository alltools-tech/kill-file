import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.js";
import statusRoutes from "./routes/status.js";
import { redis } from "./utils/redisClient.js";
import fs from "fs";

dotenv.config();

const fastify = Fastify({ logger: true });
fastify.register(fastifyCors);

// Create uploads folder if not exist
if (!fs.existsSync("./uploads")) fs.mkdirSync("./uploads", { recursive: true });

// Routes
fastify.register(uploadRoutes);
fastify.register(statusRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: process.env.API_PORT || 8080, host: "0.0.0.0" });
    console.log(`🚀 API running on http://localhost:${process.env.API_PORT || 8080}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();