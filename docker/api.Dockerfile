# Use official Node.js image
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY ../api/package*.json ./

# Install dependencies
RUN npm install

# Copy rest of API code
COPY ../api .

# Expose API port
EXPOSE 8080

# Start command
CMD ["npm", "start"]