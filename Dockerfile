# Build stage
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_FARO_COLLECTOR_URL

# Set environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_FARO_COLLECTOR_URL=$VITE_FARO_COLLECTOR_URL

# Build the application
RUN npm run build

# Production stage
FROM nginx:stable-alpine as production-stage

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 