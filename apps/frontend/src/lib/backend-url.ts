const DEFAULT_BACKEND_URL = "http://localhost:3000";

export const BACKEND_URL = (import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BACKEND_URL).replace(
  /\/+$/,
  "",
);

export function buildBackendUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return new URL(normalizedPath, `${BACKEND_URL}/`).href;
}
