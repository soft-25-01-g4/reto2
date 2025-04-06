# --- Etapa 1: Compilación (Builder) ---
# Usamos una imagen de Go con Alpine específica para reproducibilidad
FROM golang:1.24-alpine AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de módulos primero para aprovechar la caché de Docker
COPY go.mod go.sum ./
# Descargamos las dependencias
RUN go mod download

# Copiamos el resto del código fuente de la aplicación
COPY . .

# Compilamos la aplicación.
# -ldflags="-w -s" reduce el tamaño del binario eliminando información de debug y símbolos.
# CGO_ENABLED=0 intenta crear un binario estático (sin dependencias C), ideal para imágenes mínimas.
RUN CGO_ENABLED=0 go build -ldflags="-w -s" -o /app/router .

# --- Etapa 2: Imagen Final (Runtime) ---
# Usamos una imagen base mínima de Alpine. Es pequeña y común.
FROM alpine:latest

# Creamos un grupo y usuario no-root. OpenShift asignará un UID arbitrario,
# pero esta es una buena práctica de seguridad y permite permisos consistentes.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos únicamente el binario compilado desde la etapa 'builder'
# Establecemos el propietario del binario al usuario/grupo no-root
COPY --from=builder --chown=appuser:appgroup /app/router .

# Exponemos el puerto en el que la aplicación escuchará DENTRO del contenedor.
# ¡ASEGÚRATE de que tu main.go usa router.Run(":8080")!
EXPOSE 8080

# Cambiamos al usuario no-root para ejecutar la aplicación
USER appuser

# Comando para ejecutar la aplicación al iniciar el contenedor.
# Las variables CONSULTAS_URL e IDENTIDADES_URL deben ser inyectadas por OpenShift.
CMD ["./router"]