# 📝 Spring Boot 3 To-Do CRUD REST API

A beginner-friendly, production-style **Spring Boot 3 RESTful CRUD application** built with **Java 17**, **Spring Data JPA**, **PostgreSQL**, and **Lombok**.

This project serves as a complete reference and practice playground for learning backend development, layered architecture, REST API design, database persistence, automated testing, and error handling.

---

## 📑 Table of Contents
1. [🌟 High-Level Overview](#-high-level-overview)
2. [🏗️ Architecture & Request Flow](#️-architecture--request-flow)
3. [📁 Project Structure](#-project-structure)
4. [🔍 Deep-Dive: Code & Components Explained](#-deep-dive-code--components-explained)
   - [1. Application Entry Point (`TodoApplication.java`)](#1-application-entry-point-todoapplicationjava)
   - [2. Configuration & Data Seeding (`DataInitializer.java`)](#2-configuration--data-seeding-datainitializerjava)
   - [3. Entity / Model Layer (`Todo.java`)](#3-entity--model-layer-todojava)
   - [4. Repository Layer (`TodoRepository.java`)](#4-repository-layer-todorepositoryjava)
   - [5. Service Layer (`TodoService.java` & `TodoServiceImpl.java`)](#5-service-layer-todoservicejava--todoserviceimpljava)
   - [6. Controller Layer (`TodoController.java`)](#6-controller-layer-todocontrollerjava)
   - [7. Exception Handling Layer (`GlobalExceptionHandler.java`, etc.)](#7-exception-handling-layer-globalexceptionhandlerjava-etc)
   - [8. Configuration File (`application.properties`)](#8-configuration-file-applicationproperties)
   - [9. Automated Tests (`TodoControllerTest.java` & `TodoServiceImplTest.java`)](#9-automated-tests-todocontrollertestjava--todoserviceimpltestjava)
5. [🌐 REST API Endpoints & Examples](#-rest-api-endpoints--examples)
6. [🚀 Getting Started & How to Run](#-getting-started--how-to-run)
7. [🗄️ PostgreSQL Database Setup & Verification](#️-postgresql-database-setup--verification)
8. [🧪 How to Run Automated Tests](#-how-to-run-automated-tests)
9. [🎯 Beginner Practice Exercises (Next Steps)](#-beginner-practice-exercises-next-steps)

---

## 🌟 High-Level Overview

### What is a CRUD Application?
**CRUD** stands for the four basic operations performed on any database:
- **C**reate: Add new data (HTTP `POST`)
- **R**ead: Retrieve data (HTTP `GET`)
- **U**pdate: Modify existing data (HTTP `PUT` / `PATCH`)
- **D**elete: Remove data (HTTP `DELETE`)

### Tech Stack & Tools
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Java** | 17 | Core programming language |
| **Spring Boot** | 3.3.3 | Framework for building production-ready standalone apps |
| **Spring Web** | (Spring 6) | Building RESTful web APIs and MVC controllers |
| **Spring Data JPA** | 3.3.3 | Object-Relational Mapping (ORM) and simplified database access |
| **Hibernate** | 6.x | Under-the-hood JPA provider for SQL generation |
| **PostgreSQL** | 16+ | Enterprise-grade SQL relational database persisted on disk |
| **Jakarta Validation** | 3.x | Input validation (e.g. `@NotBlank`) |
| **Project Lombok** | Latest | Reduces boilerplate code (getters, setters, builders, constructors) |
| **JUnit 5 & Mockito** | Latest | Unit testing and integration testing |
| **Maven** | 3.x | Dependency management and build tool |

---

## 🏗️ Architecture & Request Flow

This application follows the industry-standard **Layered Architecture (3-Tier Architecture)**. Each layer has a single, well-defined responsibility:

```
+-------------------------------------------------------------------------+
|                              CLIENT                                     |
|           (Postman / Web Browser / Mobile App / Frontend)               |
+------------------------------------+------------------------------------+
                                     |  HTTP Request (e.g. GET /api/todos)
                                     v
+-------------------------------------------------------------------------+
|                         CONTROLLER LAYER                                |
|                        (TodoController)                                 |
|  - Receives HTTP requests                                               |
|  - Validates request body (@Valid)                                      |
|  - Calls Service layer and returns HTTP Response (JSON + Status Code)   |
+------------------------------------+------------------------------------+
                                     |  Method Call (e.g. getAllTodos())
                                     v
+-------------------------------------------------------------------------+
|                           SERVICE LAYER                                 |
|                  (TodoService / TodoServiceImpl)                        |
|  - Contains Core Business Logic                                         |
|  - Performs checks, throws custom exceptions (ResourceNotFoundException)|
|  - Interacts with Repository Layer                                      |
+------------------------------------+------------------------------------+
                                     |  Method Call (e.g. findAll())
                                     v
+-------------------------------------------------------------------------+
|                          REPOSITORY LAYER                               |
|                         (TodoRepository)                                |
|  - Spring Data JPA Interface                                            |
|  - Translates Java method calls into SQL queries via Hibernate          |
+------------------------------------+------------------------------------+
                                     |  SQL (e.g. SELECT * FROM todos)
                                     v
+-------------------------------------------------------------------------+
|                           DATABASE LAYER                                |
|                        (PostgreSQL Database)                            |
|  - Stores the 'todos' table                                             |
+-------------------------------------------------------------------------+
```

### Exception & Validation Flow
When something goes wrong (e.g., requesting an ID that does not exist or passing an empty title):
1. The Controller/Service throws an exception (e.g. `ResourceNotFoundException` or `MethodArgumentNotValidException`).
2. The `@RestControllerAdvice` class (`GlobalExceptionHandler`) intercepts the exception.
3. It converts the exception into a clean, standardized JSON response (`ErrorDetails`) with appropriate HTTP status codes (`404 Not Found`, `400 Bad Request`, etc.).

---

## 📁 Project Structure

```
FirstCRUDapp
├── pom.xml                                      # Maven project configuration & dependencies
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── todo
│   │   │               ├── TodoApplication.java             # Main Application Entry Point
│   │   │               ├── config
│   │   │               │   └── DataInitializer.java        # Pre-populates sample data at startup
│   │   │               ├── controller
│   │   │               │   └── TodoController.java         # REST Controller for HTTP Endpoints
│   │   │               ├── exception
│   │   │               │   ├── ErrorDetails.java           # Standard error response model
│   │   │               │   ├── GlobalExceptionHandler.java # Centralized exception handling
│   │   │               │   └── ResourceNotFoundException.java # Custom 404 exception
│   │   │               ├── model
│   │   │               │   └── Todo.java                   # JPA Entity (Database Table Schema)
│   │   │               ├── repository
│   │   │               │   └── TodoRepository.java         # Data Access Interface (Spring Data JPA)
│   │   │               └── service
│   │   │                   ├── TodoService.java            # Service Interface (Contracts)
│   │   │                   └── impl
│   │   │                       └── TodoServiceImpl.java    # Service Implementation (Business Logic)
│   │   └── resources
│   │       └── application.properties                      # App configuration (Port, PostgreSQL, JPA logs)
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── todo
│                       ├── controller
│                       │   └── TodoControllerTest.java     # Controller layer tests with MockMvc
│                       └── service
│                           └── TodoServiceImplTest.java    # Service layer unit tests with Mockito
└── README.md
```

---

## 🔍 Deep-Dive: Code & Components Explained

Let's break down every single file in the project so you understand why it exists, what annotations are used, and how it works.

---

### 1. Application Entry Point (`TodoApplication.java`)
**Path:** `src/main/java/com/example/todo/TodoApplication.java`

```java
@SpringBootApplication
public class TodoApplication {
    public static void main(String[] args) {
        SpringApplication.run(TodoApplication.class, args);
    }
}
```

* **Purpose:** This is the starting point of the entire application. When you run this file, Spring Boot boots up an embedded Tomcat web server on port `8080`.
* **Key Annotation:**
  * `@SpringBootApplication`: A combination of 3 key annotations:
    1. `@Configuration`: Marks the class as a source of bean definitions.
    2. `@EnableAutoConfiguration`: Automatically configures dependencies (like web server, JPA, PostgreSQL) based on `pom.xml`.
    3. `@ComponentScan`: Automatically scans all packages under `com.example.todo` to discover and create beans for Controllers, Services, and Repositories.

---

### 2. Configuration & Data Seeding (`DataInitializer.java`)
**Path:** `src/main/java/com/example/todo/config/DataInitializer.java`

```java
@Configuration
@ConditionalOnBean(TodoRepository.class)
public class DataInitializer {
    @Bean
    public CommandLineRunner initDatabase(TodoRepository repository) {
        return args -> {
            repository.save(Todo.builder()
                    .title("Learn Spring Boot 3")
                    .description("Understand Spring Boot, REST APIs, and Dependency Injection")
                    .completed(true)
                    .build());
            // ... more sample todos
        };
    }
}
```

* **Purpose:** `DataInitializer` seeds initial sample To-Do tasks into the PostgreSQL database when the server starts up.
* **Key Annotations & Concepts:**
  * `@Configuration`: Indicates this class defines Spring Beans.
  * `@ConditionalOnBean(TodoRepository.class)`: Ensures this bean is only created if `TodoRepository` is available in context (avoids issues in isolated slice tests).
  * `CommandLineRunner`: A Spring Boot interface with a `run()` method that executes immediately after the application context is loaded.

---

### 3. Entity / Model Layer (`Todo.java`)
**Path:** `src/main/java/com/example/todo/model/Todo.java`

```java
@Entity
@Table(name = "todos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "completed", nullable = false)
    private boolean completed;
}
```

* **Purpose:** Represents the **data structure** and maps directly to a SQL database table named `todos`.
* **Key Annotations:**
  * `@Entity`: Tells JPA/Hibernate that this Java class should be mapped to a database table.
  * `@Table(name = "todos")`: Names the database table `todos`.
  * `@Id`: Marks the primary key field.
  * `@GeneratedValue(strategy = GenerationType.IDENTITY)`: Auto-increments the primary key (1, 2, 3, ...).
  * `@NotBlank(message = "Title is required")`: Validates that `title` cannot be null or empty whitespace.
  * `@Column`: Configures column constraints (e.g. `nullable = false`).
  * **Lombok Annotations:**
    * `@Data`: Generates getters, setters, `equals()`, `hashCode()`, and `toString()` behind the scenes.
    * `@NoArgsConstructor` & `@AllArgsConstructor`: Generates default and parameterized constructors.
    * `@Builder`: Provides a fluent Builder pattern (`Todo.builder().title("...").build()`).

---

### 4. Repository Layer (`TodoRepository.java`)
**Path:** `src/main/java/com/example/todo/repository/TodoRepository.java`

```java
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
}
```

* **Purpose:** Handles all communication with the database.
* **Why is it empty?** By extending `JpaRepository<Todo, Long>`, Spring Data JPA automatically provides ready-to-use methods out of the box without writing any SQL:
  - `save(entity)`: Insert or update record
  - `findById(id)`: Find by primary key (returns `Optional<Todo>`)
  - `findAll()`: Retrieve all records
  - `delete(entity)` / `deleteById(id)`: Remove record
  - `count()`: Count total rows

---

### 5. Service Layer (`TodoService.java` & `TodoServiceImpl.java`)
**Paths:**
- Interface: `src/main/java/com/example/todo/service/TodoService.java`
- Implementation: `src/main/java/com/example/todo/service/impl/TodoServiceImpl.java`

```java
@Service
@RequiredArgsConstructor
public class TodoServiceImpl implements TodoService {

    private final TodoRepository todoRepository;

    @Override
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @Override
    public Todo getTodoById(Long id) {
        return todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));
    }

    @Override
    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    @Override
    public Todo updateTodo(Long id, Todo todoDetails) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        existingTodo.setTitle(todoDetails.getTitle());
        existingTodo.setDescription(todoDetails.getDescription());
        existingTodo.setCompleted(todoDetails.isCompleted());

        return todoRepository.save(existingTodo);
    }

    @Override
    public void deleteTodo(Long id) {
        Todo existingTodo = todoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found with id: " + id));

        todoRepository.delete(existingTodo);
    }
}
```

* **Purpose:** Contains the **business logic**. It coordinates between the controller and the repository.
* **Why use an Interface (`TodoService`) and Implementation (`TodoServiceImpl`)?**
  - **Decoupling / Abstraction:** The controller depends only on the contract, not the internal implementation.
  - **Testability:** Easy to mock during unit tests.
  - **Maintainability:** You can easily swap implementations (e.g., caching, cloud storage) without altering controllers.
* **Key Annotations:**
  * `@Service`: Marks this class as a Spring Service bean.
  * `@RequiredArgsConstructor`: A Lombok annotation that automatically generates a constructor for all `final` fields, enabling clean **Constructor Dependency Injection**.

---

### 6. Controller Layer (`TodoController.java`)
**Path:** `src/main/java/com/example/todo/controller/TodoController.java`

```java
@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    // GET /api/todos
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        return ResponseEntity.ok(todoService.getAllTodos());
    }

    // GET /api/todos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(todoService.getTodoById(id));
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody Todo todo) {
        return new ResponseEntity<>(todoService.createTodo(todo), HttpStatus.CREATED);
    }

    // PUT /api/todos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable("id") Long id, @Valid @RequestBody Todo todoDetails) {
        return ResponseEntity.ok(todoService.updateTodo(id, todoDetails));
    }

    // DELETE /api/todos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTodo(@PathVariable("id") Long id) {
        todoService.deleteTodo(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Todo deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }
}
```

* **Purpose:** Handles incoming HTTP requests from clients, invokes service methods, and serializes Java objects into JSON HTTP responses.
* **Key Annotations:**
  * `@RestController`: Combines `@Controller` and `@ResponseBody`. Tells Spring that every method returns JSON data directly in the response body.
  * `@RequestMapping("/api/todos")`: Base URL path prefix for all endpoints in this class.
  * `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: Route specific HTTP methods to Java methods.
  * `@PathVariable("id")`: Extracts values from the URL path (e.g. `/api/todos/1` -> `id = 1`).
  * `@RequestBody`: Deserializes the incoming JSON request payload into a `Todo` Java object.
  * `@Valid`: Triggers validation on the request body (e.g. checks `@NotBlank` on `title`).
  * `ResponseEntity<T>`: Represents the entire HTTP response (status code, headers, and body).

---

### 7. Exception Handling Layer
**Paths:**
- `ResourceNotFoundException.java`
- `ErrorDetails.java`
- `GlobalExceptionHandler.java`

#### `GlobalExceptionHandler.java`
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        // ... returns 400 BAD_REQUEST with validation field errors map
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), request.getDescription(false));
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

* **Purpose:** Centralizes error handling across the entire application so controllers don't need messy `try-catch` blocks.
* **Key Annotations:**
  * `@RestControllerAdvice`: Intercepts exceptions thrown by any `@RestController`.
  * `@ExceptionHandler(...)`: Specifies which exception type this method handles.

---

### 8. Configuration File (`application.properties`)
**Path:** `src/main/resources/application.properties`

```properties
# Application Name & Port
spring.application.name=todo-app
server.port=8080

# PostgreSQL Database Configuration
spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/tododb}
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:postgres}

# Spring Data JPA / Hibernate Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

* **`server.port=8080`**: Sets the web server port to `8080`.
* **`spring.datasource.url`**: Configures the JDBC connection URL to PostgreSQL (pointing to database `tododb` on `localhost:5432`). Can be overridden by the `SPRING_DATASOURCE_URL` environment variable.
* **`spring.datasource.username` / `password`**: Database login credentials (default: `postgres` / `postgres`). Can be overridden by `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD`.
* **`spring.jpa.hibernate.ddl-auto=update`**: Automatically creates or updates tables in PostgreSQL based on `@Entity` definitions without dropping existing data.
* **`spring.jpa.show-sql=true`**: Prints executed SQL queries into the terminal console for debugging.

---

### 9. Automated Tests
**Paths:**
- `src/test/java/com/example/todo/service/TodoServiceImplTest.java` (Unit tests)
- `src/test/java/com/example/todo/controller/TodoControllerTest.java` (Web slice tests)

#### Unit Testing with Mockito (`TodoServiceImplTest.java`)
- Uses `@ExtendWith(MockitoExtension.class)` and `@Mock` to isolate `TodoServiceImpl` from the actual database.
- Tests business logic behavior (success scenarios, not-found scenarios, save/update/delete operations).

#### Web Layer Testing with MockMvc (`TodoControllerTest.java`)
- Uses `@WebMvcTest(TodoController.class)` to test HTTP endpoints, JSON serialization/deserialization, and HTTP status codes (`200 OK`, `201 Created`, etc.) without starting a full HTTP server.

---

## 🌐 REST API Endpoints & Examples

Base URL: `http://localhost:8080`

| Operation | HTTP Method | Endpoint URL | Description | Status Code |
| :--- | :--- | :--- | :--- | :--- |
| **Get All** | `GET` | `/api/todos` | Retrieve all todo items | `200 OK` |
| **Get By ID** | `GET` | `/api/todos/{id}` | Retrieve a single todo by ID | `200 OK` or `404 Not Found` |
| **Create** | `POST` | `/api/todos` | Create a new todo item | `201 Created` or `400 Bad Request` |
| **Update** | `PUT` | `/api/todos/{id}` | Update an existing todo | `200 OK` or `404 Not Found` |
| **Delete** | `DELETE` | `/api/todos/{id}` | Delete a todo item by ID | `200 OK` or `404 Not Found` |

---

### Request & Response Examples

#### 1. Get All To-Dos
* **Request:** `GET http://localhost:8080/api/todos`
* **Response:** (`200 OK`)
```json
[
  {
    "id": 1,
    "title": "Learn Spring Boot 3",
    "description": "Understand Spring Boot, REST APIs, and Dependency Injection",
    "completed": true
  },
  {
    "id": 2,
    "title": "Build CRUD Application",
    "description": "Implement REST endpoints with Spring Data JPA and H2 database",
    "completed": false
  }
]
```

---

#### 2. Get To-Do by ID
* **Request:** `GET http://localhost:8080/api/todos/1`
* **Response:** (`200 OK`)
```json
{
  "id": 1,
  "title": "Learn Spring Boot 3",
  "description": "Understand Spring Boot, REST APIs, and Dependency Injection",
  "completed": true
}
```

* **If ID does not exist (`GET /api/todos/99`):** (`404 Not Found`)
```json
{
  "timestamp": "2026-08-24T13:00:00.000",
  "message": "Todo not found with id: 99",
  "details": "uri=/api/todos/99"
}
```

---

#### 3. Create a New To-Do
* **Request:** `POST http://localhost:8080/api/todos`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "title": "Practice Java & Spring Boot",
  "description": "Build a mini project every weekend",
  "completed": false
}
```
* **Response:** (`201 Created`)
```json
{
  "id": 4,
  "title": "Practice Java & Spring Boot",
  "description": "Build a mini project every weekend",
  "completed": false
}
```

* **If Title is empty (`""`):** (`400 Bad Request`)
```json
{
  "timestamp": "2026-08-24T13:00:00.000",
  "status": 400,
  "errors": {
    "title": "Title is required"
  }
}
```

---

#### 4. Update an Existing To-Do
* **Request:** `PUT http://localhost:8080/api/todos/2`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "title": "Build CRUD Application (Completed)",
  "description": "Finished REST endpoints with JPA & H2",
  "completed": true
}
```
* **Response:** (`200 OK`)
```json
{
  "id": 2,
  "title": "Build CRUD Application (Completed)",
  "description": "Finished REST endpoints with JPA & H2",
  "completed": true
}
```

---

#### 5. Delete a To-Do
* **Request:** `DELETE http://localhost:8080/api/todos/3`
* **Response:** (`200 OK`)
```json
{
  "message": "Todo deleted successfully with id: 3"
}
```

---

## 🚀 Getting Started & How to Run

### Prerequisites
- **Java Development Kit (JDK):** Version 17 or higher (`java -version`)
- **Apache Maven:** Version 3.8+ (`mvn -version`) *(or use your IDE's built-in Maven)*
- **API Client (Optional):** [Postman](https://www.postman.com/), [Thunder Client (VS Code)](https://www.thunderclient.com/), or `curl`.

---

### Step-by-Step Instructions

#### Option 1: Running from the Command Line / Terminal
1. Open your terminal in the project root directory:
   ```bash
   cd FirstCRUDapp
   ```
2. Build and run using Maven:
   ```bash
   mvn clean spring-boot:run
   ```
3. The server starts at `http://localhost:8080`.

#### Option 2: Running in IntelliJ IDEA / Eclipse / VS Code
1. Open the project folder in your IDE.
2. Allow Maven to download all dependencies.
3. Locate `src/main/java/com/example/todo/TodoApplication.java`.
4. Right-click and select **Run 'TodoApplication.main()'**.

---

## 🗄️ PostgreSQL Database Setup & Verification

Unlike in-memory H2, PostgreSQL stores your data persistently on disk.

### 1. Create the Database
Ensure your local PostgreSQL server is running (default port `5432`), and create the `tododb` database:
- **Using `psql` command line:**
  ```bash
  psql -U postgres
  ```
  Then inside the SQL prompt:
  ```sql
  CREATE DATABASE tododb;
  \q
  ```
- **Or using pgAdmin / DBeaver / GUI tool:**
  - Connect to your local PostgreSQL server.
  - Right click **Databases** -> **Create** -> **Database...** -> Name it `tododb`.

### 2. Configure Credentials
Check `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```
Replace `YOUR_PASSWORD` with your PostgreSQL password (or pass via the environment variable `SPRING_DATASOURCE_PASSWORD`).

### 3. Verify Database Contents
When the application starts, Hibernate will automatically create the `todos` table and `DataInitializer` will insert sample records:
- Open `psql`:
  ```bash
  psql -U postgres -d tododb
  ```
- Run:
  ```sql
  SELECT * FROM todos;
  ```

---

## 🧪 How to Run Automated Tests

Execute all unit and integration tests using Maven:

```bash
mvn test
```

You should see:
```text
[INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 🎯 Beginner Practice Exercises (Next Steps)

Ready to practice and expand your skills? Try these hands-on challenges:

1. **Add a Due Date / Priority field:**
   - Add `private LocalDate dueDate;` and `private String priority;` (e.g. `HIGH`, `MEDIUM`, `LOW`) to `Todo.java`.
   - Update `TodoServiceImpl.java` to handle the new fields in `updateTodo`.
2. **Add Custom Repository Queries:**
   - In `TodoRepository.java`, add custom query methods:
     ```java
     List<Todo> findByCompleted(boolean completed);
     List<Todo> findByTitleContainingIgnoreCase(String keyword);
     ```
   - Add new endpoints in `TodoController.java` to filter todos by status or search keyword!
3. **Add Pagination & Sorting:**
   - Update `getAllTodos` in `TodoController` to accept `Pageable` parameters (`/api/todos?page=0&size=5&sort=title,asc`).
4. **Database Migrations with Flyway or Liquibase:**
   - Add `flyway-core` to manage database schema versions instead of `ddl-auto=update`.
5. **Build a Frontend UI:**
   - Connect this REST API to a simple frontend built with HTML/JavaScript, React, Vue, or Angular!

---

💡 *Happy Coding & Learning Spring Boot!*
