import type { ProfileStats } from '@tunes/types'
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
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

  const [[favoriteStats], [historyStats], topStationRows] = await Promise.all([
    db
      .select({ favoriteCount: favoriteCountExpr })
      .from(favorite)
      .where(eq(favorite.userId, user.id)),
    db
      .select({
        totalListens: totalListensExpr,
        totalListeningSeconds: totalListeningSecondsExpr,
      })
      .from(listeningHistory)
      .where(eq(listeningHistory.userId, user.id)),
    db
      .select({
        stationId: listeningHistory.stationId,
        listenCount: stationListenCountExpr,
        totalListeningSeconds: stationTotalSecondsExpr,
      })
      .from(listeningHistory)
      .where(eq(listeningHistory.userId, user.id))
      .groupBy(listeningHistory.stationId)
      .orderBy(
        desc(stationListenCountExpr),
        desc(stationTotalSecondsExpr),
        asc(listeningHistory.stationId),
      )
      .limit(3),
  ])

  const topStationIds = topStationRows.map((row) => row.stationId)
  const latestMetadataRows =
    topStationIds.length === 0
      ? []
      : await db
          .select({
            stationId: listeningHistory.stationId,
            stationName: listeningHistory.stationName,
            stationFavicon: listeningHistory.stationFavicon,
          })
          .from(listeningHistory)
          .where(
            and(
              eq(listeningHistory.userId, user.id),
              inArray(listeningHistory.stationId, topStationIds),
            ),
          )
          .orderBy(desc(listeningHistory.listenedAt), desc(listeningHistory.id))

  const latestMetadataByStation = new Map<
    string,
    { stationName: string; stationFavicon: string | null }
  >()

  for (const row of latestMetadataRows) {
    if (!latestMetadataByStation.has(row.stationId)) {
      latestMetadataByStation.set(row.stationId, {
        stationName: row.stationName,
        stationFavicon: row.stationFavicon,
      })
    }
  }

  const payload: ProfileStats = {
    favoriteCount: toNumber(favoriteStats?.favoriteCount),
    totalListens: toNumber(historyStats?.totalListens),
    totalListeningSeconds: toNumber(historyStats?.totalListeningSeconds),
    topStations: topStationRows.map((row) => {
      const metadata = latestMetadataByStation.get(row.stationId)

      return {
        stationId: row.stationId,
        stationName: metadata?.stationName ?? row.stationId,
        stationFavicon: metadata?.stationFavicon ?? null,
        listenCount: toNumber(row.listenCount),
        totalListeningSeconds: toNumber(row.totalListeningSeconds),
      }
    }),
  }

  return c.json(ok(payload))
})

export { router as profileRouter }
