import Fastify from 'fastify';
import health from './routes/health';

const server = Fastify();

server.register(health);

server.listen({ port: 8080 }, (err, address) => {
  if (err) throw err;
  console.log(`API running at ${address}`);
});