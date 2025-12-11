# ============
# Build stage
# ============
FROM maven:3.9.9-eclipse-temurin-17 AS build

# Set working directory inside the container
WORKDIR /app

# First copy pom.xml and download dependencies (layer caching)
COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

# Now copy the source code
COPY src ./src

# Build the jar
RUN mvn clean package -DskipTests


# ============
# Runtime stage
# ============
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Optional: extra JVM options can be passed via JAVA_OPTS env
ENV JAVA_OPTS=""

# Run the jar
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
