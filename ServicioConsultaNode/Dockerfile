# --- Etapa Base ---
# Usar una imagen oficial de Node.js. Alpine es más ligera.
# Elige una versión LTS específica (ej. 20) en lugar de 'latest' para mayor estabilidad.
FROM node:20-alpine AS base

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# --- Etapa de Dependencias ---
# Copiar package.json y package-lock.json (si existe)
# Copiar estos primero aprovecha el caché de Docker si no cambian.
COPY package*.json ./

# Instalar dependencias de producción
# 'npm ci' es generalmente preferido en CI/builds para instalaciones limpias y rápidas usando package-lock.json
# Si no tienes package-lock.json o prefieres 'npm install', puedes usar: RUN npm install --only=production
RUN npm ci --only=production

# --- Etapa de Ejecución ---
# Reutilizar la imagen base para mantenerla ligera
FROM node:20-alpine

WORKDIR /usr/src/app

# Copiar las dependencias instaladas desde la etapa de dependencias
COPY --from=base /usr/src/app/node_modules ./node_modules

# Copiar el código de la aplicación
COPY . .

# (Opcional pero recomendado) Crear un usuario no-root para ejecutar la aplicación
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Exponer el puerto en el que la aplicación corre (según tu código, es 5000)
EXPOSE 5000

# Comando para ejecutar la aplicación cuando el contenedor inicie
# Usa el nombre de tu archivo principal (ej. server.js)
CMD [ "node", "service.js" ]