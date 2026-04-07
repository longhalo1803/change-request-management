FROM node:20.12.2

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci && \
    npm cache clean --force && \
    mkdir -p uploads logs

COPY . .

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "run", "dev"]
