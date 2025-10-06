import { v4 as uuidv4 } from "uuid";
import { redis } from "../utils/redisClient.js";
import fs from "fs";
import path from "path";

export default async function uploadRoutes(fastify, opts) {
  // Upload endpoint
  fastify.post("/upload", async (req, reply) => {
    const data = await req.file();

    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filename = `${uuidv4()}-${data.filename}`;
    const filepath = path.join(uploadDir, filename);

    await data.toBuffer().then((buf) => fs.writeFileSync(filepath, buf));

    const jobId = uuidv4();
    const job = {
      id: jobId,
      file: filename,
      status: "queued",
      createdAt: new Date().toISOString(),
    };

    await redis.set(`job:${jobId}`, JSON.stringify(job));

    // Push to worker queue
    await redis.lpush("jobQueue", JSON.stringify(job));

    return { jobId, message: "File uploaded and job queued successfully" };
  });
}