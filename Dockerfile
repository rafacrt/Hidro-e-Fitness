# Stage 1: Install dependencies
FROM node:20-slim AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Stage 2: Build the application
FROM node:20-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Garantir que a pasta public existe
RUN mkdir -p public

RUN npm run build

# Stage 3: Production image
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Criar estrutura de pastas
RUN mkdir -p public

# Copiar arquivos construídos
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiar pasta public
COPY --from=builder /app/public ./public

EXPOSE 3000

USER node

CMD ["npm", "start", "--", "-p", "3000"]