# =====================================================
# BEAN — Life Intelligence Platform
# Multi-stage Dockerfile for production
# =====================================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps
LABEL stage=deps

# Install libc compatibility for native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy workspace manifests
COPY package.json ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/types/package.json ./packages/types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/config/package.json ./packages/config/

# Install dependencies
RUN npm ci --include=dev

# --- Stage 2: Builder ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Build the web app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace=apps/web

# --- Stage 3: Runner (Production) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets and built output
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
