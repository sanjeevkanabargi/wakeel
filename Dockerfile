FROM node:18-alpine

WORKDIR /app

# Install dependencies (use package-lock if present for reproducible builds)
COPY package*.json ./
RUN npm ci --only=production || npm install --production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy app sources
COPY . .

EXPOSE 3000

# Run the server
CMD ["node", "server.js"]

# Docker HEALTHCHECK uses the /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
	CMD curl -f http://localhost:3000/health || exit 1
