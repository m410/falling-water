# Frontend Dockerfile - Angular 21 App
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/frontend ./apps/frontend
COPY libs ./libs

# Build the frontend
RUN npx nx build frontend --configuration=production

# Production stage - nginx to serve static files
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist/apps/frontend/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
