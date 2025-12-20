# -----------------------------------------------------------------------------
# FASE 1: BUILD
# Se encarga de compilar y empaquetar la aplicación en un JAR
# -----------------------------------------------------------------------------
FROM maven:3.9-eclipse-temurin-21 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de configuración de Maven para descargar dependencias
COPY pom.xml .

# Descarga las dependencias del proyecto. Usamos 'mvn dependency:go-offline' para asegurar que
# todas las dependencias estén disponibles.
RUN mvn dependency:go-offline -B

# Copia el código fuente del proyecto
COPY src ./src

COPY Wallet_J5CZ0BX9RIVK63AW ./Wallet_J5CZ0BX9RIVK63AW

# Empaqueta la aplicación Spring Boot en un JAR ejecutable
RUN mvn package -DskipTests

# -----------------------------------------------------------------------------
# FASE 2: RUNTIME
# Solo contiene el entorno mínimo de ejecución (JRE)
# -----------------------------------------------------------------------------
# Usamos Eclipse Temurin 21 JRE, que es ligero y seguro.
FROM eclipse-temurin:21-jre-alpine

# Etiqueta para identificar la versión de la aplicación
ARG JAR_FILE=target/*.jar

# Establece el directorio de trabajo para la fase de ejecución
WORKDIR /opt/app

# Copia el JAR generado desde la fase 'build' al contenedor final
COPY --from=build /app/${JAR_FILE} app.jar

COPY --from=build /app/Wallet_J5CZ0BX9RIVK63AW ./Wallet_J5CZ0BX9RIVK63AW

# Expone el puerto por defecto de Spring Boot
EXPOSE 8082

# Comando para ejecutar la aplicación
# - La opción 'java -jar' es el método tradicional y robusto.
USER 1000

# Se recomienda usar el formato 'exec' (corchetes) para que la JVM se ejecute como PID 1
# y maneje correctamente las señales de apagado (como Ctrl+C o la señal SIGTERM de Docker/Portainer).
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]