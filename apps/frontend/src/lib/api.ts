import type { ApiResponse } from "@tunes/types";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function get<T>(path: string): Promise<T> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`api${normalizedPath}`, `${BASE_URL}/`).href;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new ApiError(`HTTP error ${response.status}: ${response.statusText}`);
  }

  const body: ApiResponse<T> = await response.json();

  if (!body.success) {
    throw new ApiError(body.error ?? "Unknown API error");
  }

  return body.data;
}
