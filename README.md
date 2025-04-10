# Project Readme

This project build a experiment to demostrate the acomplishment of the ASR of Availability and Security and is formed for the following Components

## Components

### 1.  Router Service

* **Description:** A Go-based service (`router/main.go`) that acts as a router. It likely receives external requests, validates them agains Identity services, and forwards them to appropriate internal services[cite: 3].
* **Key Features:**
    * Request validation.
    * Request forwarding.
    * Uses Gin framework.
    * Configuration via environment variables (`CONSULTAS_URL`, `IDENTIDADES_URL`).

### 2.  Identity Service

* **Description:** A Python/FastAPI service (`identidades/main.py`) responsible for validating credentials (likely tokens)[cite: 3].
* **Key Features:**
    * Token validation against a whitelist in order to simplify the experiment (`whitelist.json`).
    * API endpoints for validation (`/identidades/validar`).

### 3.  Consulta Services

* **Description:** Multiple services (Java, Python, Node.js) that seem to process "consulta" requests. They all have a similar function: receive a request, generate a response with static content in order to simplify the experiment, and log the request and response.
* **Key Features:**
    * **Java (`ServicioConsultaJava`):**
        * Spring Boot application.
        * Handles POST requests to `/consulta`.
        * Logs data to `/opt/data/data_servicio.txt`.
    * **Python (`ServicioConsultaPython`):**
        * Flask application.
        * Handles POST requests to `/consulta`.
        * Logs data to `/opt/data/log_python.txt`.
    * **Node.js (`ServicioConsultaNode`):**
        * Express application.
        * Handles POST requests to `/consulta`.
        * Logs data to `/opt/data/log_nodejs.txt`.
        * Simulates occasional errors by returning random `cantidad`.

### 4.  Coordinador Service

* **Description:** A Node. js/NestJS service (`coordinador/src/main.ts`) that coordinates requests to the Consulta services and implements a voting mechanism.
* **Key Features:**
    * Forwards requests to Consulta services.
    * Implements a voting algorithm to determine the final response.
    * Logs the voting results to `/opt/data/coordinador.txt`.
    * Uses NestJS framework.

### 5.  Jupyter Notebook Analysis [cite: 2]

* A Jupyter Notebook (`RevisionResultados.ipynb`) is included for analyzing the logs generated by the services, particularly for voting analysis and error detection[cite: 2].

### 6.  Kubernetes Configuration

* The `kubernetes/` directory contains the Kubernetes configuration files, This includes:
    * Deployments for services (router, identidades, consultas).
    * Services to expose the deployments.
    * Build configurations.
    * Routes (OpenShift).
    * Persistent volume claims for data storage.

## General Characteristics

* **Microservices Architecture:** The project was structured as a microservices architecture, with independent services for routing, identity validation, and data processing.
* **Multi-Language:** The services are implemented in multiple programming languages (Go, Python, Java, Node.js), demonstrating a polyglot approach.
* **Logging:** Each service implements logging to `/opt/data/`, which is used for analysis.
* **Kubernetes Deployment:** The system is designed for containerized deployment and orchestration.
* **Voting Mechanism:** A voting mechanism is used in the coordinator, suggesting a fault-tolerant or consensus-based approach to data processing.
* **Data Analysis:** Jupyter Notebooks are used for offline analysis of service behavior.
