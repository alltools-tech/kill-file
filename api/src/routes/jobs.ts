import { FastifyPluginAsync } from 'fastify';
import Redis from 'ioredis';

// Create a Redis client (adjust host/port if needed)
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis', // 'redis' is the service name in docker-compose
  port: 6379,
});

const jobs: FastifyPluginAsync = async (fastify) => {
  // Create new job
  fastify.post('/jobs', async (request, reply) => {
    // TODO: Validate request body, sanitize input
    const jobId = 'job_' + Date.now();

    // Example job payload (expand as needed)
    const jobPayload = {
      jobId,
      status: 'created',
      createdAt: Date.now(),
      input: request.body, // will contain file info/options
    };

    // Push job into Redis queue
    await redis.rpush('job-queue', JSON.stringify(jobPayload));

    return { jobId, status: 'created' };
  });

  // Get job status (mock, later from DB/Redis)
  fastify.get('/jobs/:id', async (request, reply) => {
    // This is a mock; for real use, check DB/Redis for status
    return { jobId: request.params.id, status: 'mock-status' };
  });
};

export default jobs;