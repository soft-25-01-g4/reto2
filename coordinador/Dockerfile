# ----------- Stage 1: Builder -----------
# Usar una imagen base de Node.js con herramientas de construcción
FROM node:20 AS builder

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de definición de paquetes
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies necesarias para el build)
# Usar --frozen-lockfile para asegurar builds reproducibles si usas package-lock.json
# Montar caché de npm para acelerar builds posteriores (si tu entorno Docker lo soporta)
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm install --frozen-lockfile

# Copiar el resto del código fuente de la aplicación
COPY . .

# Construir la aplicación (compilar TypeScript a JavaScript)
RUN npm run build

# Eliminar las dependencias de desarrollo después del build
# (Alternativa a instalar solo --production en la etapa final)
RUN npm prune --omit=dev


# ----------- Stage 2: Final Image -----------
# Usar una imagen base de Node.js más ligera para producción (slim o alpine)
FROM node:20-slim AS final

# Establecer el entorno a producción
ENV NODE_ENV=production
# Puedes establecer aquí la variable PORT si no quieres que dependa del entorno de ejecución
# ENV PORT=3000

# Crear un grupo y usuario no-root para ejecutar la aplicación
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar los artefactos construidos y las dependencias de producción desde la etapa 'builder'
# --chown asegura que el usuario 'nestjs' sea el propietario de los archivos copiados
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/package*.json ./

# Cambiar al usuario no-root

RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -m -s /bin/bash nestjs
USER nestjs

# Exponer el puerto en el que la aplicación escucha (según tu main.ts)
EXPOSE 3000

# Comando para ejecutar la aplicación compilada
# Usar 'node dist/main.js' es generalmente preferido en producción a 'npm run start:prod'
CMD [ "node", "dist/main.js" ]