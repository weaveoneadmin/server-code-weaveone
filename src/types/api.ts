export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}
