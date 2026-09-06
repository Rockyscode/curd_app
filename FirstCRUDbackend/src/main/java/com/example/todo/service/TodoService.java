package com.example.todo.service;

import com.example.todo.model.Todo;

import java.util.List;

/**
 * TodoService interface declaring CRUD operations for Todo entities.
 */
public interface TodoService {

    List<Todo> getAllTodos();

    Todo getTodoById(Long id);

    Todo createTodo(Todo todo);

    Todo updateTodo(Long id, Todo todoDetails);

    void deleteTodo(Long id);
}
