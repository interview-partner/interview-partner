# Step 1: Build the application
FROM gradle:7.5.1-jdk17 as builder

# Set the working directory
WORKDIR /app

# Copy build files
COPY build.gradle settings.gradle /app/

# Copy source code
COPY src /app/src

# Build the application
RUN gradle build --no-daemon

# Step 2: Create the runtime image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the built jar file from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application with the specified profile, default to 'dev' if not provided
ENTRYPOINT ["sh", "-c", "java -jar -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-dev} app.jar"]
