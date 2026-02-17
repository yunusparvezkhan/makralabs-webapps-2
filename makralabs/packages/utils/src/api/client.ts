export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientOptions {
  baseUrl: string;
  headers?: HeadersInit;
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: HeadersInit;
}

export function createApiClient(options: ApiClientOptions) {
  const { baseUrl, headers: defaultHeaders } = options;

  return async function request<T>(path: string, requestOptions: RequestOptions = {}): Promise<T> {
    const { method = "GET", body, headers } = requestOptions;

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return (await response.json()) as T;
  };
}
