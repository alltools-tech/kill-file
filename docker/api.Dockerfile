# ===== Node.js API =====
FROM node:20-alpine

WORKDIR /app

# Copy package files if exist
COPY api/package*.json ./
RUN npm install --production || true

# Copy all source
COPY api/ ./

EXPOSE 8080
CMD ["node", "src/index.js"]