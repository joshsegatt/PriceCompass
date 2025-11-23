FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (including dev) for build and Prisma generation
COPY server/package*.json ./
RUN npm ci

# Copy server source
COPY server/ .

# Generate Prisma client and build
RUN npx prisma generate --schema=prisma/schema.prisma
RUN npm run build

FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy production deps (we'll copy node_modules from builder to preserve generated Prisma client)
COPY server/package*.json ./

# Copy node_modules (installed in builder) to runtime to preserve generated client
COPY --from=builder /app/node_modules ./node_modules

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (optional) and entrypoint
COPY server/prisma ./prisma
COPY server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
