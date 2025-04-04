# --- Stage 1: Base ---
# Usa una imagen oficial de Python como imagen base.
# Las versiones 'slim' son más ligeras, buenas para producción.
# Asegúrate de que esta versión de Python sea compatible con tu código y dependencias.
FROM python:3.12-slim AS base

# Establece variables de entorno recomendadas para Python en contenedores
ENV PYTHONDONTWRITEBYTECODE 1 # Evita que Python escriba archivos .pyc
ENV PYTHONUNBUFFERED 1      # Hace que los logs de Python salgan directamente, sin buffer

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# --- Stage 2: Build Dependencies ---
# Copia solo el archivo de requerimientos primero para aprovechar el caché de Docker
COPY requirements.txt .

# Actualiza pip e instala las dependencias especificadas en requirements.txt
# --no-cache-dir evita guardar el caché de descarga, reduciendo el tamaño de la imagen
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# --- Stage 3: Application ---
# Copia el resto del código de tu aplicación al directorio de trabajo /app
# Esto incluye main.py, la carpeta controllers/, etc.
COPY . .

# Expone el puerto en el que correrá la aplicación dentro del contenedor.
# OpenShift generalmente espera el puerto 8080. Uvicorn también usará este puerto.
EXPOSE 8080

# Define el comando por defecto que se ejecutará cuando el contenedor inicie.
# Ejecuta el servidor Uvicorn:
# - Le dice que busque el objeto llamado 'app' en el archivo 'main.py'.
# - Escucha en todas las interfaces de red disponibles ('0.0.0.0').
# - Usa el puerto 8080.
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]