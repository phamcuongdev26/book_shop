# Stage 1: Build Frontend
FROM node:20-alpine AS fe-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build
# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-21 AS be-build
WORKDIR /app
COPY pom.xml ./
COPY backend/ ./backend/
COPY --from=fe-build /app/frontend/dist ./backend/src/main/resources/static/
RUN mvn clean package -DskipTests -pl backend -am
# Stage 3: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=be-build /app/backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
