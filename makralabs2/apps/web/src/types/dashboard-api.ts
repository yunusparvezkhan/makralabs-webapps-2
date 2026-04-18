export interface DashboardUser {
  _id?: string;
  id?: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface DashboardApiKeyRecord {
  _id?: string;
  id?: string;
  keyId?: string;
  name: string;
  key?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface DashboardApiError extends Error {
  status: number;
  details?: unknown;
}
