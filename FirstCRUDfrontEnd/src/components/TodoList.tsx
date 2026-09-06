import React from 'react';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { EmptyState } from './EmptyState';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  isSearchOrFiltered: boolean;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  isLoading,
  onToggle,
  onEdit,
  onDelete,
  isSearchOrFiltered,
  onClearFilters,
  onOpenCreateModal,
}) => {
  if (isLoading && todos.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(item => (
          <div
            key={item}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 animate-pulse flex items-start space-x-3.5"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <EmptyState
        isSearchOrFiltered={isSearchOrFiltered}
        onClearFilters={onClearFilters}
        onOpenCreateModal={onOpenCreateModal}
      />
    );
  }

  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
