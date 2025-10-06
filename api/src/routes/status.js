import { redis } from "../utils/redisClient.js";

export default async function statusRoutes(fastify, opts) {
  // Check job status
  fastify.get("/status/:jobId", async (req, reply) => {
    const jobData = await redis.get(`job:${req.params.jobId}`);
    if (!jobData) {
      return reply.status(404).send({ error: "Job not found" });
    }
    const job = JSON.parse(jobData);
    return { job };
  });
}