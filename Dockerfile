FROM oven/bun:1.4-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API
ARG NEXT_PUBLIC_API_PREFIX=/api/proxy
ARG NEXT_PUBLIC_KEY
ARG NEXT_PUBLIC_ENV=PRODUCTION
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_VERSION_API=v1

ENV NEXT_PUBLIC_API=${NEXT_PUBLIC_API} \
    NEXT_PUBLIC_API_PREFIX=${NEXT_PUBLIC_API_PREFIX} \
    NEXT_PUBLIC_KEY=${NEXT_PUBLIC_KEY} \
    NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_VERSION_API=${NEXT_PUBLIC_VERSION_API} \
    NEXT_TELEMETRY_DISABLED=1

RUN bun run build

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["bun", "run", "start"]
