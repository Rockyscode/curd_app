import React from 'react';
import { Check, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  isUpdating?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isUpdating = false,
}) => {
  return (
    <div
      className={`group relative bg-white dark:bg-slate-900 border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? 'border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/20 dark:bg-emerald-950/10'
          : 'border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Toggle Checkbox and Content */}
        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
          {/* Custom Animated Checkbox */}
          <button
            onClick={() => onToggle(todo)}
            disabled={isUpdating}
            aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30 ring-2 ring-emerald-500/20'
                : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500 dark:hover:border-brand-400 bg-white dark:bg-slate-800'
            }`}
          >
            {todo.completed ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-transparent group-hover:bg-slate-300 dark:group-hover:bg-slate-600 transition-colors" />
            )}
          </button>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h3
                className={`text-base font-semibold transition-all break-words ${
                  todo.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-900 dark:text-slate-100'
                }`}
              >
                {todo.title}
              </h3>
              {todo.id && (
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  #{todo.id}
                </span>
              )}
            </div>

            {todo.description && (
              <p
                className={`mt-1 text-sm leading-relaxed whitespace-pre-line ${
                  todo.completed
                    ? 'text-slate-400 dark:text-slate-600'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Status indicator tag */}
            <div className="mt-3 flex items-center space-x-2">
              <span
                className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  todo.completed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {todo.completed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-3 h-3" />
                    <span>Pending</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(todo)}
            title="Edit Task"
            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/60 dark:hover:text-brand-300 rounded-lg transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => todo.id && onDelete(todo.id)}
            title="Delete Task"
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 dark:hover:text-rose-300 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
