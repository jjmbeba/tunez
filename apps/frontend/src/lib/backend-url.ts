const DEFAULT_DEV_BACKEND_URL = 'http://localhost:3000'
const configuredDevBackendUrl = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '')
  : undefined

export const DEV_BACKEND_URL = configuredDevBackendUrl ?? DEFAULT_DEV_BACKEND_URL
export const AUTH_BASE_URL = import.meta.env.DEV ? DEV_BACKEND_URL : undefined

export function buildBackendUrl(path: string): string {
  const normalizedPath = `/${path.replace(/^\/+/, '')}`

  if (import.meta.env.PROD) {
    return normalizedPath
  }

  return new URL(normalizedPath, `${DEV_BACKEND_URL}/`).href
}
