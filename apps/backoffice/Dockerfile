# Backoffice Dockerfile - Angular 21 App
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/backoffice ./apps/backoffice
COPY libs ./libs

# Build the backoffice
RUN npx nx build backoffice --configuration=production

# Production stage - nginx to serve static files
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/backoffice/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application
COPY --from=builder /app/dist/apps/backoffice/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
