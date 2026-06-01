import type { MiddlewareHandler } from 'hono'
import { auth } from '../auth.js'
import { fail } from '../lib/response.js'

export type AppBindings = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}

async function resolveSession(headers: Headers) {
  return auth.api.getSession({ headers })
}

async function setAuthContext(c: Parameters<MiddlewareHandler<AppBindings>>[0]) {
  const authSession = await resolveSession(c.req.raw.headers)

  if (!authSession) {
    c.set('user', null)
    c.set('session', null)

    return null
  }

  c.set('user', authSession.user)
  c.set('session', authSession.session)

  return authSession
}

export const optionalAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  await setAuthContext(c)
  await next()
}

export const requireAuth: MiddlewareHandler<AppBindings> = async (c, next) => {
  const authSession = await setAuthContext(c)

  if (!authSession) {
    return c.json(fail('Unauthorized'), 401)
  }

  await next()
}

export type AuthenticatedUser = NonNullable<AppBindings['Variables']['user']>

export function getAuthenticatedUser(c: Parameters<MiddlewareHandler<AppBindings>>[0]): AuthenticatedUser {
  const user = c.get('user')

  if (!user) {
    throw new Error('Authenticated user is unavailable outside requireAuth boundary.')
  }

  return user
}
