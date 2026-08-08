# Zerops Copilot

AI-powered Deployment Assistant for Zerops.

## Overview
This is the Spring Boot backend service for Zerops Copilot. It provides a RESTful API for managing projects, deployments, and generating AI-powered analyses for deployments.

## Technology Stack
- **Java 21**
- **Spring Boot 3**
- **Maven**
- **PostgreSQL**
- **Libraries**: Spring Web, Spring Data JPA, Validation, Lombok, SpringDoc (Swagger), SLF4J, MapStruct

## Running the Application

### Prerequisites
- Java 21+
- Maven 3.9+
- PostgreSQL database

### Local Setup
1. Configure your PostgreSQL database settings in `src/main/resources/application.properties` or `application.yml`.
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```

### Docker
To build and run via Docker:
```bash
docker build -t zerops-copilot-backend .
docker run -p 8080:8080 zerops-copilot-backend
```

## API Documentation
Once the application is running, the Swagger UI documentation is available at:
`http://localhost:8080/swagger-ui/index.html` (or `swagger-ui.html` depending on config)

## Architecture
The application follows standard SOLID principles and a strict layered architecture:
`Controller` -> `Service` -> `Repository` -> `Database`

Data Transfer Objects (DTOs) are used strictly for all API requests and responses to ensure internal Entity objects are never exposed directly to the clients.
