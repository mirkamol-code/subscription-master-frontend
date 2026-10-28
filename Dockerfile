# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (separate layer → better cache hits)
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# Copy the rest of the source
COPY . .

# Build the production SPA bundle.
# Vite automatically loads .env.production, which sets VITE_API_BASE_URL=/api.
RUN npm run build

# ─── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM nginx:alpine AS runner

# Remove the default Nginx welcome page config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy the built SPA assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container.
# On EC2 your host Nginx reverse-proxies to this port.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
