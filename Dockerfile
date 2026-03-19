# ==============================================================================
# BASE — imagen compartida con dependencias comunes
# ==============================================================================
FROM node:24-alpine AS base

WORKDIR /app

# Decirle a sharp que NO use libvips global → usa el binario precompilado (musl)
ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Instalar pnpm con versión fija (misma que en local)
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Copiar manifests de dependencias
COPY package.json pnpm-lock.yaml ./


# ==============================================================================
# DEPENDENCIES — instala SOLO prod deps (sin devDependencies)
# ==============================================================================
FROM base AS deps

# Libs necesarias para compilar módulos nativos (argon2)
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

RUN pnpm install --frozen-lockfile --prod


# ==============================================================================
# BUILD — compila el proyecto NestJS
# ==============================================================================
FROM base AS build

# Libs necesarias para compilar módulos nativos (argon2)
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Instalar TODAS las deps (incluye devDependencies para compilar)
RUN pnpm install --frozen-lockfile

# Copiar código fuente
COPY . .

# Compilar TypeScript → dist/
RUN pnpm run build


# ==============================================================================
# PRODUCTION — imagen final mínima y segura
# ==============================================================================
FROM node:24-alpine AS production

WORKDIR /app

ENV SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Crear usuario no-root (buena práctica de seguridad)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Instalar pnpm con versión fija
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

# Copiar solo lo necesario desde los stages anteriores
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Cambiar ownership al usuario no-root
RUN chown -R appuser:appgroup /app

USER appuser

# Exponer el puerto
EXPOSE 8000

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=8000

# Healthcheck apuntando al endpoint real con global prefix
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8000/api/v1/andean/health || exit 1

CMD ["node", "dist/main"]


# ==============================================================================
# DEVELOPMENT — igual que estaba, para uso con docker-compose local
# ==============================================================================
FROM base AS development

# Libs necesarias para compilar módulos nativos (argon2)
RUN apk add --no-cache python3 make g++ && \
    ln -sf python3 /usr/bin/python

# Instalar todas las deps (incluyendo devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

ENV NODE_ENV=development \
    PORT=8000

# Comando por defecto (se sobrescribe en docker-compose)
CMD ["pnpm", "run", "start:dev"]
