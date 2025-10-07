import { FastifyPluginAsync } from 'fastify';

const jobs: FastifyPluginAsync = async (fastify) => {
  // Create new job
  fastify.post('/jobs', async (request, reply) => {
    // TODO: Validate request, generate jobId, save in DB, enqueue in Redis
    // For now, just return mock jobId
    const jobId = 'job_' + Date.now();
    return { jobId, status: 'created' };
  });

  // Get job status
  fastify.get('/jobs/:id', async (request, reply) => {
    // TODO: Fetch job status from DB/Redis
    return { jobId: request.params.id, status: 'mock-status' };
  });
};

export default jobs;