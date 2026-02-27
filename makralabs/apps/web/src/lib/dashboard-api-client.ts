import { env } from "@/lib/env";
import type { DashboardApiError, DashboardApiKeyRecord, DashboardUser } from "@/types/dashboard-api";

type DashboardAuthHeaderOptions = {
  token?: string | null;
  apiKey?: string | null;
};

type DashboardRequestOptions = Omit<RequestInit, "headers" | "body"> & {
  headers?: Record<string, string>;
  body?: unknown;
};

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object") {
    return {};
  }

  return value as Record<string, unknown>;
}

function createDashboardApiError(status: number, details: unknown, fallbackMessage: string): DashboardApiError {
  const payload = asRecord(details);
  const message =
    typeof payload.message === "string"
      ? payload.message
      : typeof payload.error === "string"
        ? payload.error
        : fallbackMessage;

  const error = new Error(message) as DashboardApiError;
  error.status = status;
  error.details = details;

  return error;
}

function buildHeaders(options: DashboardRequestOptions, auth?: DashboardAuthHeaderOptions) {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...options.headers
  };

  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`;
  }

  if (auth?.apiKey) {
    headers["Api-Key"] = auth.apiKey;
  }

  return headers;
}

async function request<T>(path: string, options: DashboardRequestOptions = {}, auth?: DashboardAuthHeaderOptions): Promise<T> {
  const response = await fetch(`${env.NEXT_PUBLIC_API_ORIGIN}${path}`, {
    ...options,
    headers: buildHeaders(options, auth),
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    throw createDashboardApiError(response.status, payload, `Request failed with status ${response.status}`);
  }

  return payload as T;
}

function findToken(payload: unknown) {
  const record = asRecord(payload);

  if (typeof record.access_token === "string") {
    return record.access_token;
  }

  if (typeof record.accessToken === "string") {
    return record.accessToken;
  }

  if (typeof record.token === "string") {
    return record.token;
  }

  return null;
}

function findUser(payload: unknown): DashboardUser | null {
  const record = asRecord(payload);

  if (record.user && typeof record.user === "object") {
    const nestedUser = record.user as DashboardUser;
    if (typeof nestedUser.email === "string") {
      return nestedUser;
    }
  }

  if (typeof record.email === "string") {
    return record as DashboardUser;
  }

  return null;
}

function unwrapKeys(payload: unknown): DashboardApiKeyRecord[] {
  if (Array.isArray(payload)) {
    return payload as DashboardApiKeyRecord[];
  }

  const objectPayload = asRecord(payload);

  if (Array.isArray(objectPayload.keys)) {
    return objectPayload.keys as DashboardApiKeyRecord[];
  }

  if (Array.isArray(objectPayload.apiKeys)) {
    return objectPayload.apiKeys as DashboardApiKeyRecord[];
  }

  if (Array.isArray(objectPayload.data)) {
    return objectPayload.data as DashboardApiKeyRecord[];
  }

  return [];
}

function findNumber(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const preferredFields = ["balance", "credits", "credit_balance", "creditBalance", "remaining", "remaining_credits"];

  for (const field of preferredFields) {
    const candidate = record[field];
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === "string") {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  for (const nested of Object.values(record)) {
    const candidate = findNumber(nested);
    if (candidate !== null) {
      return candidate;
    }
  }

  return null;
}

async function authenticate(path: string, email: string, password: string) {
  const payload = await request<unknown>(path, {
    method: "POST",
    body: { email, password }
  });

  const accessToken = findToken(payload);

  if (!accessToken) {
    throw createDashboardApiError(500, payload, "Access token was missing from auth response");
  }

  const user = findUser(payload);

  return {
    accessToken,
    user
  };
}

export async function dashboardHealthCheck() {
  return request<{ status: string }>("/healthz", { method: "GET", cache: "no-store" });
}

export async function dashboardRegister(email: string, password: string) {
  return authenticate("/auth/register", email, password);
}

export async function dashboardLogin(email: string, password: string) {
  return authenticate("/auth/login", email, password);
}

export async function dashboardGetCurrentUser(token: string) {
  const payload = await request<unknown>("/auth/user", { method: "GET", cache: "no-store" }, { token });
  const user = findUser(payload);

  if (!user) {
    throw createDashboardApiError(500, payload, "Unable to parse current user response");
  }

  return user;
}

export async function dashboardListApiKeys(token: string) {
  const payload = await request<unknown>("/api/keys", { method: "GET", cache: "no-store" }, { token });
  return unwrapKeys(payload);
}

export async function dashboardCreateApiKey(token: string, name: string) {
  return request<DashboardApiKeyRecord & Record<string, unknown>>(
    "/api/keys",
    {
      method: "POST",
      body: { name }
    },
    { token }
  );
}

export async function dashboardDeleteApiKey(token: string, keyId: string) {
  return request<unknown>(`/api/keys/${keyId}`, { method: "DELETE" }, { token });
}

export async function dashboardGetBalance(auth: DashboardAuthHeaderOptions) {
  const payload = await request<unknown>("/api/balance", { method: "GET", cache: "no-store" }, auth);
  const balance = findNumber(payload);

  if (balance === null) {
    throw createDashboardApiError(500, payload, "Unable to parse balance response");
  }

  return balance;
}

export async function dashboardConsumeCredits(auth: DashboardAuthHeaderOptions, amount = 1) {
  const payload = await request<unknown>(
    "/api/consume",
    {
      method: "POST",
      body: amount > 1 ? { amount } : {}
    },
    auth
  );

  const balance = findNumber(payload);

  if (balance === null) {
    throw createDashboardApiError(500, payload, "Unable to parse consume response");
  }

  return balance;
}
