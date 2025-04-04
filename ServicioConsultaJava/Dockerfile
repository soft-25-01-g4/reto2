# --- Etapa de Compilación (Build Stage) ---
# Usamos una imagen base de Maven que incluye JDK 21
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /app

# Copiamos primero el pom.xml para aprovechar el caché de Docker.
COPY pom.xml .

# (Opcional pero recomendado si tienes muchas dependencias y cambias código frecuentemente)
# RUN mvn dependency:go-offline

# Copiamos el código fuente de la aplicación
COPY src ./src

# Compilamos la aplicación y la empaquetamos.
# mvn package debería invocar al spring-boot-maven-plugin si está en el pom.xml
RUN mvn clean package -DskipTests

# --- Etapa de Ejecución (Runtime Stage) ---
# Usamos una imagen base de JRE de JDK 21, más ligera.
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# ----- ¡¡¡ AJUSTE CLAVE AQUÍ !!! -----
# Copia el JAR ejecutable específico generado por Spring Boot desde la etapa 'builder'.
# REEMPLAZA 'tu-aplicacion-springboot-0.0.1-SNAPSHOT.jar' con el nombre REAL de tu JAR ejecutable.
COPY --from=builder /app/target/ServicioConsulta-1.0-SNAPSHOT.jar app.jar

# Exponemos el puerto que usa Spring Boot (por defecto es 8080, ajusta si lo cambiaste en application.properties/yml)
EXPOSE 8080

# El ENTRYPOINT sigue siendo el mismo, ya que ejecutamos el JAR ejecutable de Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]