import { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: 6379,
});

const jobs: FastifyPluginAsync = async (fastify) => {
  // Create new job
  fastify.post('/jobs', async (request, reply) => {
    const jobId = 'job_' + Date.now();
    const jobPayload = {
      jobId,
      status: 'created',
      createdAt: Date.now(),
      input: request.body,
    };
    await redis.rpush('job-queue', JSON.stringify(jobPayload));
    // Set initial job status
    await redis.set(`job:${jobId}`, "created");
    return { jobId, status: 'created' };
  });

  // Get job status (from Redis)
  fastify.get('/jobs/:id', async (request, reply) => {
    const jobId = request.params.id;
    const status = await redis.get(`job:${jobId}`);
    return { jobId, status: status || 'not-found' };
  });
};

export default jobs;