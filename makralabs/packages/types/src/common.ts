export type Nullable<T> = T | null;

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}
