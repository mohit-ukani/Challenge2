# ============================================
# Stage 1: Build the React app with Vite
# ============================================
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build-time environment variables (baked into static bundle)
# These are public-facing keys — restrict by domain in GCP Console
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_GOOGLE_MAPS_API_KEY
ARG VITE_GOOGLE_MAPS_MAP_ID
ARG VITE_GOOGLE_CALENDAR_CLIENT_ID
ARG VITE_GOOGLE_CALENDAR_API_KEY
ARG VITE_GEMINI_API_KEY

# Build the production bundle
RUN npm run build

# ============================================
# Stage 2: Serve with Nginx (Alpine for minimal image)
# ============================================
FROM nginx:stable-alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Cloud Run expects port 8080
EXPOSE 8080

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
