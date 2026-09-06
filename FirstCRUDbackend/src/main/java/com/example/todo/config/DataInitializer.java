package com.example.todo.config;

import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * DataInitializer configuration to seed initial sample Todo items into the database.
 * Only runs when TodoRepository bean is present in the Spring context.
 */
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

            repository.save(Todo.builder()
                    .title("Build CRUD Application")
                    .description("Implement REST endpoints with Spring Data JPA and PostgreSQL database")
                    .completed(false)
                    .build());

            repository.save(Todo.builder()
                    .title("Master Lombok & Hibernate")
                    .description("Practice entity mapping and reducing boilerplate code")
                    .completed(false)
                    .build());
        };
    }
}
