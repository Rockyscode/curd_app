package com.example.todo.service;

import com.example.todo.exception.ResourceNotFoundException;
import com.example.todo.model.Todo;
import com.example.todo.repository.TodoRepository;
import com.example.todo.service.impl.TodoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TodoServiceImplTest {

    @Mock
    private TodoRepository todoRepository;

    @InjectMocks
    private TodoServiceImpl todoService;

    private Todo todo1;
    private Todo todo2;

    @BeforeEach
    void setUp() {
        todo1 = new Todo(1L, "Test Todo 1", "Description 1", false);
        todo2 = new Todo(2L, "Test Todo 2", "Description 2", true);
    }

    @Test
    void testGetAllTodos() {
        when(todoRepository.findAll()).thenReturn(Arrays.asList(todo1, todo2));

        List<Todo> result = todoService.getAllTodos();

        assertThat(result).hasSize(2);
        verify(todoRepository, times(1)).findAll();
    }

    @Test
    void testGetTodoByIdSuccess() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));

        Todo result = todoService.getTodoById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getTitle()).isEqualTo("Test Todo 1");
    }

    @Test
    void testGetTodoByIdNotFound() {
        when(todoRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> todoService.getTodoById(99L));
    }

    @Test
    void testCreateTodo() {
        when(todoRepository.save(any(Todo.class))).thenReturn(todo1);

        Todo created = todoService.createTodo(todo1);

        assertThat(created).isNotNull();
        assertThat(created.getId()).isEqualTo(1L);
    }

    @Test
    void testUpdateTodo() {
        Todo updateDetails = new Todo(null, "Updated Title", "Updated Desc", true);

        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));
        when(todoRepository.save(any(Todo.class))).thenReturn(todo1);

        Todo updated = todoService.updateTodo(1L, updateDetails);

        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        assertThat(updated.isCompleted()).isTrue();
    }

    @Test
    void testDeleteTodo() {
        when(todoRepository.findById(1L)).thenReturn(Optional.of(todo1));
        doNothing().when(todoRepository).delete(todo1);

        todoService.deleteTodo(1L);

        verify(todoRepository, times(1)).delete(todo1);
    }
}
