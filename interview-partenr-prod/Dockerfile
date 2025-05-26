FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production stage
FROM node:16-alpine

WORKDIR /app
COPY --from=builder /app ./
RUN npm prune --production

EXPOSE 4000
CMD ["node", "app.js"]
