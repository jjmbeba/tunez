import { and, eq, lt, or } from 'drizzle-orm'
import * as v from 'valibot'
import { listeningHistory } from '../db/schema.js'

export const DEFAULT_HISTORY_PAGE_SIZE = 50
export const MAX_HISTORY_PAGE_SIZE = 200

export const historyQuerySchema = v.object({
  limit: v.optional(
    v.pipe(
      v.union([v.string(), v.number()], 'limit must be a number'),
      v.transform((input) => (typeof input === 'number' ? input : Number(input))),
      v.integer('limit must be a whole number'),
      v.minValue(1, 'limit must be at least 1'),
      v.maxValue(MAX_HISTORY_PAGE_SIZE, `limit must be at most ${MAX_HISTORY_PAGE_SIZE}`),
    ),
    DEFAULT_HISTORY_PAGE_SIZE,
  ),
  cursor: v.optional(v.string('cursor must be a string')),
})

export interface HistoryCursor {
  listenedAt: string
  id: string
}

export function encodeHistoryCursor(row: typeof listeningHistory.$inferSelect): string {
  return Buffer.from(
    JSON.stringify({
      listenedAt: row.listenedAt.toISOString(),
      id: row.id,
    } satisfies HistoryCursor),
    'utf8',
  ).toString('base64url')
}

export function decodeHistoryCursor(cursor: string): HistoryCursor | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as Partial<HistoryCursor>

    if (typeof parsed.listenedAt !== 'string' || typeof parsed.id !== 'string') {
      return null
    }

    const listenedAt = new Date(parsed.listenedAt)
    if (Number.isNaN(listenedAt.getTime())) {
      return null
    }

    return {
      listenedAt: listenedAt.toISOString(),
      id: parsed.id,
    }
  } catch {
    return null
  }
}

export function buildHistoryCursorFilter(userId: string, cursor: HistoryCursor | null) {
  if (!cursor) {
    return eq(listeningHistory.userId, userId)
  }

  const cursorDate = new Date(cursor.listenedAt)

  return and(
    eq(listeningHistory.userId, userId),
    or(
      lt(listeningHistory.listenedAt, cursorDate),
      and(eq(listeningHistory.listenedAt, cursorDate), lt(listeningHistory.id, cursor.id)),
    )!,
  )!
}
