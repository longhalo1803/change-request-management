FROM node:20.12.2 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM node:20.12.2 AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:20.12.2 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/locales ./dist/locales
COPY --from=builder /app/node_modules ./node_modules

RUN npm prune --omit=dev && \
    npm cache clean --force && \
    mkdir -p uploads logs && \
    groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs -m -s /bin/bash appuser && \
    chown -R appuser:nodejs /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "run", "start"]
