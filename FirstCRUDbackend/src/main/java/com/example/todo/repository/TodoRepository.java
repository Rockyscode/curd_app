package com.example.todo.repository;

import com.example.todo.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * TodoRepository interface providing CRUD operations for Todo entity via Spring Data JPA.
 */
@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
}
