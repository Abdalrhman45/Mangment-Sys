# Stage 1: Build Angular application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the Angular app for production
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy built Angular app to Nginx
COPY --from=build /app/dist/employee-management /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]