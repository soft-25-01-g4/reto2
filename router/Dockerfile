# --- Stage 1: Build ---
# Usa una imagen oficial de Go como base para la compilación
FROM golang:1.24-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de módulos y dependencias primero
# Asume que go.mod y go.sum están en el directorio raíz del contexto (la carpeta 'router')
COPY go.mod go.sum ./

# Descarga las dependencias
RUN go mod download

# Copia TODO el código fuente desde el contexto (la carpeta 'router') al WORKDIR
COPY . .

# Construye la aplicación Go
# - CGO_ENABLED=0: Deshabilita CGO para una compilación estática
# - GOOS=linux: Asegura que se compile para Linux
# -o /app/router: Especifica el nombre y la ruta del ejecutable de salida
# main.go ahora está en el WORKDIR /app
RUN CGO_ENABLED=0 GOOS=linux go build -v -a -installsuffix cgo -o /app/router ./main.go

# --- Stage 2: Run ---
# Usa una imagen base mínima para la ejecución
FROM alpine:latest

# Establece el directorio de trabajo
WORKDIR /app

# Copia SOLO el binario compilado desde la etapa 'builder'
COPY --from=builder /app/router .

# Expone el puerto en el que la aplicación escucha
EXPOSE 8080

# Establece el modo de Gin a 'release' para producción
ENV GIN_MODE=release

# Variables de entorno requeridas por la aplicación (config/EnvConfig.go)
# Deberás proporcionarlas al ejecutar el contenedor con 'docker run -e ...'
# ENV CONSULTAS_URL=http://your-consultas-service-url
# ENV IDENTIDADES_URL=http://your-identidades-service-url

# Comando para ejecutar la aplicación cuando el contenedor inicie
CMD ["./router"]
