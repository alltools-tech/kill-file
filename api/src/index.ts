import Fastify from 'fastify';
import health from './routes/health';
import jobs from './routes/jobs';
import presign from './routes/presign';

const server = Fastify();

server.register(health);
server.register(jobs);
server.register(presign);

server.listen({ port: 8080 }, (err, address) => {
  if (err) throw err;
  console.log(`API running at ${address}`);
});