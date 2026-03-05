# ─── Base Stage ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
RUN npm install -g pnpm@9
WORKDIR /app

# ─── Dependencies Stage ──────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY prisma/ ./prisma/
COPY apps/backend/package.json ./apps/backend/
COPY packages/config/package.json ./packages/config/
COPY packages/ui/package.json ./packages/ui/
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm --filter @hms/backend exec prisma generate --schema prisma/schema.prisma

# ─── Development Stage ──────────────────────────────────────────────────────
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY . .
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["pnpm", "dev"]

# ─── Build Stage ────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @hms/backend build

# ─── Production Stage ───────────────────────────────────────────────────────
FROM node:22-alpine AS production
RUN npm install -g pnpm@9
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/package.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/main"]
