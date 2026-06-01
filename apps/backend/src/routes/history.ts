import type { ListeningHistory, PaginatedListeningHistory } from '@tunes/types'
import { vValidator } from '@hono/valibot-validator'
import { desc } from 'drizzle-orm'
import { Hono } from 'hono'
import * as v from 'valibot'
import { db } from '../db/index.js'
import { ID_MAX_LENGTH, STATION_NAME_MAX_LENGTH, URL_MAX_LENGTH } from '../lib/field-limits.js'
import {
  buildHistoryCursorFilter,
  decodeHistoryCursor,
  encodeHistoryCursor,
  historyQuerySchema,
} from '../lib/history-pagination.js'
import { fail, ok } from '../lib/response.js'
import {
  normalizedOptionalUrl,
  optionalIsoDate,
  requiredUrlString,
  trimmedRequiredString,
  validationHook,
} from '../lib/validation.js'
import { listeningHistory } from '../db/schema.js'
import { getAuthenticatedUser, requireAuth, type AppBindings } from '../middleware/auth.js'

const router = new Hono<AppBindings>()

router.use('*', requireAuth)

const createHistorySchema = v.object({
  stationId: trimmedRequiredString('stationId', ID_MAX_LENGTH),
  stationName: trimmedRequiredString('stationName', STATION_NAME_MAX_LENGTH),
  stationStreamUrl: requiredUrlString('stationStreamUrl', URL_MAX_LENGTH),
  stationFavicon: normalizedOptionalUrl('stationFavicon', URL_MAX_LENGTH),
  duration: v.pipe(
    v.number('duration must be a non-negative number'),
    v.minValue(0, 'duration must be a non-negative number'),
  ),
  listenedAt: optionalIsoDate('listenedAt'),
})

function toHistory(row: typeof listeningHistory.$inferSelect): ListeningHistory {
  return {
    id: row.id,
    userId: row.userId,
    stationId: row.stationId,
    stationName: row.stationName,
    stationFavicon: row.stationFavicon,
    stationStreamUrl: row.stationStreamUrl,
    listenedAt: row.listenedAt.toISOString(),
    duration: row.duration,
    createdAt: row.createdAt.toISOString(),
  }
}

router.get('/', vValidator('query', historyQuerySchema, validationHook), async (c) => {
  const user = getAuthenticatedUser(c)
  const { limit, cursor } = c.req.valid('query')
  const decodedCursor = cursor ? decodeHistoryCursor(cursor) : null

  if (cursor && !decodedCursor) {
    return c.json(fail('cursor must be a valid pagination cursor'), 400)
  }

  const rows = await db
    .select()
    .from(listeningHistory)
    .where(buildHistoryCursorFilter(user.id, decodedCursor))
    .orderBy(desc(listeningHistory.listenedAt), desc(listeningHistory.id))
    .limit(limit)

  const payload: PaginatedListeningHistory = {
    items: rows.map(toHistory),
    nextCursor: rows.length < limit ? null : encodeHistoryCursor(rows[rows.length - 1]),
  }

  return c.json(ok(payload))
})

router.post('/', vValidator('json', createHistorySchema, validationHook), async (c) => {
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
    duration: parsed.duration,
    listenedAt: parsed.listenedAt ?? now,
    createdAt: now,
  } satisfies typeof listeningHistory.$inferInsert

  await db.insert(listeningHistory).values(row)

  return c.json(ok(toHistory(row)), 201)
})

export { router as historyRouter }
