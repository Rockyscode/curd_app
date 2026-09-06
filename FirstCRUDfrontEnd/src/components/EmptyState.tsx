import React from 'react';
import { ClipboardList, Plus, SearchX } from 'lucide-react';

interface EmptyStateProps {
  isSearchOrFiltered: boolean;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isSearchOrFiltered,
  onClearFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-4">
        {isSearchOrFiltered ? (
          <SearchX className="w-8 h-8" />
        ) : (
          <ClipboardList className="w-8 h-8 text-brand-500" />
        )}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
        {isSearchOrFiltered ? 'No matching tasks found' : 'No tasks yet'}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
        {isSearchOrFiltered
          ? 'Try adjusting your search criteria or changing the filter options.'
          : 'Stay organized and boost your productivity by adding your first task.'}
      </p>

      {isSearchOrFiltered ? (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg transition-colors"
        >
          Reset Filters
        </button>
      ) : (
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create First Task</span>
        </button>
      )}
    </div>
  );
};
