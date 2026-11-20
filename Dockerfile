# Multi-stage secure build for Amazing Smile Dental Care
FROM node:22-alpine AS dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8123

# Create non-root user for container security hardening
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and application files
COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY server ./server
COPY assets ./assets
COPY logo ./logo
COPY *.html ./

# Ensure data directory exists with write permissions for non-root user
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

USER appuser

EXPOSE 8123

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8123/api/health || exit 1

CMD ["node", "server/index.js"]
