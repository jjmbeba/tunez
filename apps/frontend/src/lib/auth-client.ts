import { AUTH_BASE_URL } from '@/lib/backend-url'
import { anonymousClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  ...(AUTH_BASE_URL ? { baseURL: AUTH_BASE_URL } : {}),
  plugins: [anonymousClient()],
})

export const { signIn, signOut, getSession, useSession } = authClient

type SessionResponse = Awaited<ReturnType<typeof getSession>>
export type AuthSession = NonNullable<SessionResponse['data']>

let anonymousSessionPromise: Promise<AuthSession> | null = null

async function readSession(): Promise<AuthSession | null> {
  const session = await getSession({
    fetchOptions: {
      credentials: 'include',
    },
  })

  return session.data ?? null
}

async function createAnonymousSession(): Promise<AuthSession> {
  const existingSession = await readSession()
  if (existingSession) {
    return existingSession
  }

  const signInResult = await signIn.anonymous({
    fetchOptions: {
      credentials: 'include',
    },
  })

  if (signInResult.error) {
    throw new Error(signInResult.error.message ?? 'Anonymous sign-in failed.', {
      cause: signInResult.error,
    })
  }

  const session = await readSession()
  if (session) {
    return session
  }

  throw new Error('Anonymous session was not available after sign-in.')
}

export function ensureAnonymousSession(): Promise<AuthSession> {
  if (!anonymousSessionPromise) {
    anonymousSessionPromise = createAnonymousSession().finally(() => {
      anonymousSessionPromise = null
    })
  }

  return anonymousSessionPromise
}
