export interface PaginationState {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  column: string;
  direction: SortDirection;
}

export interface FilterOption {
  label: string;
  value: string;
}

export type OperationFeedbackType = 'success' | 'warning' | 'error' | 'info';

export interface OperationNotification {
  id: string;
  title: string;
  message: string;
  type: OperationFeedbackType;
  timestamp: string;
  read?: boolean;
}
