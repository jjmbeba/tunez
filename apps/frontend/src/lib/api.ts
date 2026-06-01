import type { ApiResponse } from "@tunes/types";
import { buildBackendUrl } from "@/lib/backend-url";

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(method: "GET" | "POST" | "DELETE", path: string, body?: unknown): Promise<T> {
  const response = await fetch(buildBackendUrl(`/api${path.startsWith("/") ? path : `/${path}`}`), {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });

  if (!response.ok) {
    throw new ApiError(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const responseBody: ApiResponse<T> = await response.json();

  if (!responseBody.success) {
    throw new ApiError(responseBody.error ?? "Unknown API error");
  }

  return responseBody.data;
}

export async function get<T>(path: string): Promise<T> {
  return await request<T>("GET", path);
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  return await request<T>("POST", path, body);
}

export async function deleteRequest<T>(path: string): Promise<T> {
  return await request<T>("DELETE", path);
}

export { deleteRequest as delete };
