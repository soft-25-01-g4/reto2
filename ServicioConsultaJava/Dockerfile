# --- Etapa de Compilación (Build Stage) ---
# Usamos una imagen base de Maven que incluye JDK 21 (Eclipse Temurin es una distribución popular de OpenJDK)
FROM maven:3.9-eclipse-temurin-21 AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero el pom.xml para aprovechar el caché de Docker.
# Si el pom.xml no cambia, las dependencias no se descargarán de nuevo.
COPY pom.xml .

# Descargamos las dependencias (opcional, pero puede acelerar builds posteriores si solo cambia el código fuente)
# Descomenta la siguiente línea si quieres descargar dependencias por separado.
# RUN mvn dependency:go-offline

# Copiamos el código fuente de la aplicación
COPY src ./src

# Compilamos la aplicación y la empaquetamos en un JAR.
# -DskipTests omite la ejecución de tests durante la construcción de la imagen.
RUN mvn clean package -DskipTests

# --- Etapa de Ejecución (Runtime Stage) ---
# Usamos una imagen base de JRE (Java Runtime Environment) de JDK 21, que es más ligera que el JDK completo.
FROM eclipse-temurin:21-jre-jammy

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el JAR compilado desde la etapa de 'builder' a la etapa actual.
# Asegúrate de que el nombre del JAR ('target/mi-aplicacion-*.jar') coincida con el artefacto generado por Maven.
# Puedes usar el nombre exacto si lo conoces, o un patrón. Renombrarlo a 'app.jar' simplifica el comando ENTRYPOINT.
COPY --from=builder /app/target/*.jar app.jar

# Exponemos el puerto en el que la aplicación escuchará.
# Cambia el '8080' si tu aplicación usa un puerto diferente (ej. Spring Boot por defecto usa 8080).
EXPOSE 8080

# Definimos el comando que se ejecutará cuando el contenedor inicie.
# Ejecuta la aplicación Java contenida en el JAR.
ENTRYPOINT ["java", "-jar", "app.jar"]