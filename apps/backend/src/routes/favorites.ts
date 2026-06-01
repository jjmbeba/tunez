import type { Favorite } from '@tunes/types'
import { vValidator } from '@hono/valibot-validator'
import { and, desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import * as v from 'valibot'
import { db } from '../db/index.js'
import { ID_MAX_LENGTH, STATION_NAME_MAX_LENGTH, URL_MAX_LENGTH } from '../lib/field-limits.js'
import { ok, fail } from '../lib/response.js'
import {
  normalizedOptionalUrl,
  requiredUrlString,
  trimmedRequiredString,
  validationHook,
} from '../lib/validation.js'
import { favorite } from '../db/schema.js'
import { getAuthenticatedUser, requireAuth, type AppBindings } from '../middleware/auth.js'

const router = new Hono<AppBindings>()

router.use('*', requireAuth)

const createFavoriteSchema = v.object({
  stationId: trimmedRequiredString('stationId', ID_MAX_LENGTH),
  stationName: trimmedRequiredString('stationName', STATION_NAME_MAX_LENGTH),
  stationStreamUrl: requiredUrlString('stationStreamUrl', URL_MAX_LENGTH),
  stationFavicon: normalizedOptionalUrl('stationFavicon', URL_MAX_LENGTH),
})

const favoriteParamSchema = v.object({
  id: trimmedRequiredString('id', ID_MAX_LENGTH),
})

function toFavorite(row: typeof favorite.$inferSelect): Favorite {
  return {
    id: row.id,
    userId: row.userId,
    stationId: row.stationId,
    stationName: row.stationName,
    stationFavicon: row.stationFavicon,
    stationStreamUrl: row.stationStreamUrl,
    createdAt: row.createdAt.toISOString(),
  }
}

router.get('/', async (c) => {
  const user = getAuthenticatedUser(c)

  const rows = await db
    .select()
    .from(favorite)
    .where(eq(favorite.userId, user.id))
    .orderBy(desc(favorite.createdAt))

  return c.json(ok(rows.map(toFavorite)))
})

router.post('/', vValidator('json', createFavoriteSchema, validationHook), async (c) => {
  const user = getAuthenticatedUser(c)
  const parsed = c.req.valid('json')

  const now = new Date()
  const row = {
    id: crypto.randomUUID(),
    userId: user.id,
    stationId: parsed.stationId,
    stationName: parsed.stationName,
    stationFavicon: parsed.stationFavicon ?? null,
    stationStreamUrl: parsed.stationStreamUrl,
    createdAt: now,
  } satisfies typeof favorite.$inferInsert

  await db
    .insert(favorite)
    .values(row)
    .onConflictDoNothing({ target: [favorite.userId, favorite.stationId] })

  const [saved] = await db
    .select()
    .from(favorite)
    .where(and(eq(favorite.userId, user.id), eq(favorite.stationId, parsed.stationId)))
    .limit(1)

  if (!saved) {
    throw new Error('Favorite could not be loaded after write')
  }

  return c.json(ok(toFavorite(saved)), saved.id === row.id ? 201 : 200)
})

router.delete('/:id', vValidator('param', favoriteParamSchema, validationHook), async (c) => {
  const user = getAuthenticatedUser(c)
  const { id: favoriteId } = c.req.valid('param')

  const [existing] = await db
    .select()
    .from(favorite)
    .where(and(eq(favorite.userId, user.id), eq(favorite.id, favoriteId)))
    .limit(1)

  if (!existing) {
    return c.json(fail('Favorite not found'), 404)
  }

  await db
    .delete(favorite)
    .where(and(eq(favorite.userId, user.id), eq(favorite.id, favoriteId)))

  return c.json(ok(toFavorite(existing)))
})

export { router as favoritesRouter }
