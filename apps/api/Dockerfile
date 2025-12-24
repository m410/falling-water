# API Dockerfile - Express 5 Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api ./apps/api
COPY libs ./libs

# Build the API
RUN npx nx build api --configuration=production

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files for production dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/dist/apps/api ./dist/apps/api

# Create storage directory for uploads
RUN mkdir -p /app/storage

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "dist/apps/api/main.js"]
