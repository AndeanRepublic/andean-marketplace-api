# Dockerfile para desarrollo
FROM node:23-alpine

WORKDIR /app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 8000

# Comando por defecto (se sobrescribe en docker-compose)
CMD ["pnpm", "run", "start:dev"]