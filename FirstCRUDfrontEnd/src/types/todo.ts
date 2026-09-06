export interface Todo {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
}

export type FilterStatus = 'ALL' | 'ACTIVE' | 'COMPLETED';
export type SortOption = 'NEWEST' | 'OLDEST' | 'TITLE_ASC' | 'TITLE_DESC';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
