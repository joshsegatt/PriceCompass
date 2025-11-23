# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS frontend-builder
WORKDIR /app-frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Stage 2: Build Backend ---
FROM node:18-alpine AS backend-builder
WORKDIR /app-backend
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

# --- Stage 3: Runtime ---
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy backend production deps
COPY server/package*.json ./
COPY --from=backend-builder /app-backend/node_modules ./node_modules

# Copy backend built artifacts
COPY --from=backend-builder /app-backend/dist ./dist

# Copy frontend built artifacts to 'client' folder in backend
COPY --from=frontend-builder /app-frontend/dist ./client

# Copy Prisma schema and entrypoint
COPY server/prisma ./prisma
COPY server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
