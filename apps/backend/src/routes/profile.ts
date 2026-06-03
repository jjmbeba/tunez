import type { ProfileStats } from '@tunes/types'
import { asc, desc, eq, sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { favorite, listeningHistory } from '../db/schema.js'
import { db } from '../db/index.js'
import { ok } from '../lib/response.js'
import { getAuthenticatedUser, requireAuth, type AppBindings } from '../middleware/auth.js'

const router = new Hono<AppBindings>()

router.use('*', requireAuth)

function toNumber(value: unknown): number {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

router.get('/stats', async (c) => {
  const user = getAuthenticatedUser(c)

  const favoriteCountExpr = sql<number>`count(*)`
  const totalListensExpr = sql<number>`count(*)`
  const totalListeningSecondsExpr = sql<number>`coalesce(sum(${listeningHistory.duration}), 0)`
  const stationListenCountExpr = sql<number>`count(*)`
  const stationTotalSecondsExpr = sql<number>`coalesce(sum(${listeningHistory.duration}), 0)`

  const [favoriteStats] = await db
    .select({ favoriteCount: favoriteCountExpr })
    .from(favorite)
    .where(eq(favorite.userId, user.id))

  const [historyStats] = await db
    .select({
      totalListens: totalListensExpr,
      totalListeningSeconds: totalListeningSecondsExpr,
    })
    .from(listeningHistory)
    .where(eq(listeningHistory.userId, user.id))

  const topStationRows = await db
    .select({
      stationId: listeningHistory.stationId,
      stationName: listeningHistory.stationName,
      stationFavicon: listeningHistory.stationFavicon,
      listenCount: stationListenCountExpr,
      totalListeningSeconds: stationTotalSecondsExpr,
    })
    .from(listeningHistory)
    .where(eq(listeningHistory.userId, user.id))
    .groupBy(
      listeningHistory.stationId,
      listeningHistory.stationName,
      listeningHistory.stationFavicon,
    )
    .orderBy(
      desc(stationListenCountExpr),
      desc(stationTotalSecondsExpr),
      asc(listeningHistory.stationName),
    )
    .limit(3)

  const payload: ProfileStats = {
    favoriteCount: toNumber(favoriteStats?.favoriteCount),
    totalListens: toNumber(historyStats?.totalListens),
    totalListeningSeconds: toNumber(historyStats?.totalListeningSeconds),
    topStations: topStationRows.map((row) => ({
      stationId: row.stationId,
      stationName: row.stationName,
      stationFavicon: row.stationFavicon,
      listenCount: toNumber(row.listenCount),
      totalListeningSeconds: toNumber(row.totalListeningSeconds),
    })),
  }

  return c.json(ok(payload))
})

export { router as profileRouter }
