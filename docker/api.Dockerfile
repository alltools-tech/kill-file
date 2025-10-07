FROM node:20-alpine
WORKDIR /app
COPY ./api/package.json ./
COPY ./api/tsconfig.json ./
RUN npm install
COPY ./api/src ./src
EXPOSE 8080
CMD ["npm", "start"]