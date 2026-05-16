import type { ApiResponse } from "@tunes/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}/api/${path}`, {
    headers: {
      Accept: "application/json",
    },
  });

  const body: ApiResponse<T> = await response.json();

  if (!body.success) {
    throw new ApiError(body.error ?? "Unknown API error");
  }

  return body.data;
}
