import { FastifyPluginAsync } from 'fastify';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Get env from process.env or .env
const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || 'http://minio:9000';
const MINIO_ACCESS_KEY = process.env.MINIO_ROOT_USER || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_ROOT_PASSWORD || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'uploads';

const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: MINIO_ENDPOINT,
  credentials: {
    accessKeyId: MINIO_ACCESS_KEY,
    secretAccessKey: MINIO_SECRET_KEY,
  },
  forcePathStyle: true, // MinIO/S3 compatibility
});

const presign: FastifyPluginAsync = async (fastify) => {
  fastify.post('/presign', async (request, reply) => {
    const { filename } = request.body as { filename: string };
    if (!filename) {
      reply.code(400).send({ error: 'filename required' });
      return;
    }

    // Generate presigned PUT URL (valid for 10 min)
    const command = new PutObjectCommand({
      Bucket: MINIO_BUCKET,
      Key: filename,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 600 });
    return { url, filename };
  });
};

export default presign;