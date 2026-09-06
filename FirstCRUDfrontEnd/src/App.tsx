import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';
import { TodoFormModal } from './components/TodoFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Toast } from './components/Toast';
import { ConnectionBanner } from './components/ConnectionBanner';
import { useTheme } from './hooks/useTheme';
import { todoApi } from './services/api';
import { Todo, FilterStatus, SortOption, ToastMessage } from './types/todo';

const INITIAL_FALLBACK_TODOS: Todo[] = [
  {
    id: 1,
    title: 'Learn Spring Boot 3',
    description: 'Understand Spring Boot, REST APIs, and Dependency Injection',
    completed: true,
  },
  {
    id: 2,
    title: 'Build CRUD Application',
    description: 'Implement REST endpoints with Spring Data JPA and H2 database',
    completed: false,
  },
  {
    id: 3,
    title: 'Master Lombok & Hibernate',
    description: 'Practice entity mapping and reducing boilerplate code',
    completed: false,
  },
];

export function App() {
  const { theme, toggleTheme } = useTheme();

  // Todos State
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  // Filters and Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('NEWEST');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [deletingTodo, setDeletingTodo] = useState<Todo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch Todos
  const loadTodos = useCallback(async (showToast = false) => {
    setIsLoading(true);
    try {
      const data = await todoApi.getAll();
      setTodos(data);
      setIsBackendConnected(true);
      if (showToast) {
        addToast('success', 'Synchronized with Spring Boot backend.');
      }
    } catch (err) {
      console.warn('Backend unavailable, utilizing local storage/demo fallback:', err);
      setIsBackendConnected(false);
      // Load fallback or localStorage
      const saved = localStorage.getItem('local_todos');
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch {
          setTodos(INITIAL_FALLBACK_TODOS);
        }
      } else {
        setTodos(INITIAL_FALLBACK_TODOS);
      }
      if (showToast) {
        addToast('info', 'Running in local demo mode (Spring Boot offline).');
      }
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Persist to local storage if backend offline
  useEffect(() => {
    if (isBackendConnected === false && todos.length > 0) {
      localStorage.setItem('local_todos', JSON.stringify(todos));
    }
  }, [todos, isBackendConnected]);

  // Create or Update Handler
  const handleSaveTodo = async (todoData: Omit<Todo, 'id'> | Todo) => {
    if ('id' in todoData && todoData.id) {
      // UPDATE
      if (isBackendConnected) {
        const updated = await todoApi.update(todoData.id, todoData);
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      } else {
        setTodos(prev => prev.map(t => (t.id === todoData.id ? (todoData as Todo) : t)));
      }
      addToast('success', `Updated "${todoData.title}"`);
    } else {
      // CREATE
      if (isBackendConnected) {
        const created = await todoApi.create(todoData);
        setTodos(prev => [created, ...prev]);
      } else {
        const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id || 0)) + 1 : 1;
        const newTodo: Todo = { ...todoData, id: newId };
        setTodos(prev => [newTodo, ...prev]);
      }
      addToast('success', `Created "${todoData.title}"`);
    }
  };

  // Toggle Completion
  const handleToggleComplete = async (todo: Todo) => {
    if (!todo.id) return;
    const updatedStatus = !todo.completed;

    // Optimistic UI Update
    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, completed: updatedStatus } : t))
    );

    try {
      if (isBackendConnected) {
        await todoApi.update(todo.id, { ...todo, completed: updatedStatus });
      }
      addToast(
        'info',
        updatedStatus ? `Completed "${todo.title}"` : `Marked "${todo.title}" as active`
      );
    } catch {
      // Rollback on error
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, completed: todo.completed } : t))
      );
      addToast('error', 'Failed to update task status.');
    }
  };

  // Delete Action
  const handleDeleteConfirm = async () => {
    if (!deletingTodo?.id) return;
    setIsDeleting(true);
    try {
      if (isBackendConnected) {
        await todoApi.delete(deletingTodo.id);
      }
      setTodos(prev => prev.filter(t => t.id !== deletingTodo.id));
      addToast('success', `Deleted "${deletingTodo.title}"`);
      setDeletingTodo(null);
    } catch {
      addToast('error', 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search & Sort Computation
  const filteredTodos = useMemo(() => {
    return todos
      .filter(todo => {
        // Status filter
        if (statusFilter === 'ACTIVE' && todo.completed) return false;
        if (statusFilter === 'COMPLETED' && !todo.completed) return false;

        // Search query filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = todo.title.toLowerCase().includes(query);
          const matchDesc = todo.description?.toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'NEWEST') return (b.id || 0) - (a.id || 0);
        if (sortOption === 'OLDEST') return (a.id || 0) - (b.id || 0);
        if (sortOption === 'TITLE_ASC') return a.title.localeCompare(b.title);
        if (sortOption === 'TITLE_DESC') return b.title.localeCompare(a.title);
        return 0;
      });
  }, [todos, statusFilter, searchQuery, sortOption]);

  const counts = useMemo(() => {
    return {
      all: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    };
  }, [todos]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header / Navbar */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenCreateModal={() => {
          setEditingTodo(null);
          setIsFormModalOpen(true);
        }}
        isBackendConnected={isBackendConnected}
        onRefresh={() => loadTodos(true)}
        isLoading={isLoading}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backend Connection Status Banner */}
        <ConnectionBanner
          isConnected={isBackendConnected}
          onRetry={() => loadTodos(true)}
        />

        {/* Dashboard Metrics */}
        <StatsOverview todos={todos} />

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortOption={sortOption}
          onSortOptionChange={setSortOption}
          counts={counts}
        />

        {/* Task List */}
        <TodoList
          todos={filteredTodos}
          isLoading={isLoading}
          onToggle={handleToggleComplete}
          onEdit={todo => {
            setEditingTodo(todo);
            setIsFormModalOpen(true);
          }}
          onDelete={id => {
            const found = todos.find(t => t.id === id);
            if (found) setDeletingTodo(found);
          }}
          isSearchOrFiltered={Boolean(searchQuery || statusFilter !== 'ALL')}
          onClearFilters={() => {
            setSearchQuery('');
            setStatusFilter('ALL');
          }}
          onOpenCreateModal={() => {
            setEditingTodo(null);
            setIsFormModalOpen(true);
          }}
        />
      </main>

      {/* Modals */}
      <TodoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTodo(null);
        }}
        onSubmit={handleSaveTodo}
        initialTodo={editingTodo}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingTodo)}
        todo={deletingTodo}
        onClose={() => setDeletingTodo(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Notifications Toast */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>
          TaskMaster CRUD Application • Spring Boot 3 REST API + React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;
