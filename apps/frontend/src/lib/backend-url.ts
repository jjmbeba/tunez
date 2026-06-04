const DEFAULT_BACKEND_URL = 'http://localhost:3000'
const configuredBackendUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')

export const BACKEND_URL =
  configuredBackendUrl ??
  (import.meta.env.PROD && typeof window !== 'undefined' ? window.location.origin : DEFAULT_BACKEND_URL)

export function buildBackendUrl(path: string): string {
  const normalizedPath = path.replace(/^\/+/, '')

  return new URL(normalizedPath, `${BACKEND_URL}/`).href
}
