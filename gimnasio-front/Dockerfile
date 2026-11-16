# ==========================================
# Stage 1: Node.js Compilation & Bundling
# ==========================================
FROM node:22-alpine AS builder
WORKDIR /app

# Parámetros de construcción para inyectar las URLs base de API e IA
ARG VITE_API_URL=/api
ARG VITE_IA_URL=/api/v1/ia
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_IA_URL=$VITE_IA_URL

COPY package.json package-lock.json ./
RUN npm ci --silent

COPY . .
RUN npm run build

# ==========================================
# Stage 2: High-Performance Production Nginx Server
# ==========================================
FROM nginx:1.27-alpine AS runner

# Herramienta para healthcheck
RUN apk add --no-cache curl

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

