import type { ListeningHistory } from "@tunes/types";
import { vValidator } from '@hono/valibot-validator'
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import * as v from 'valibot'
import { db } from "../db/index.js";
import { ok } from "../lib/response.js";
import {
  normalizedOptionalUrl,
  optionalIsoDate,
  requiredUrlString,
  trimmedRequiredString,
  validationHook,
} from '../lib/validation.js'
import { listeningHistory } from "../db/schema.js";
import { getAuthenticatedUser, requireAuth, type AppBindings } from "../middleware/auth.js";

const router = new Hono<AppBindings>();

router.use("*", requireAuth);

const createHistorySchema = v.object({
  stationId: trimmedRequiredString('stationId'),
  stationName: trimmedRequiredString('stationName'),
  stationStreamUrl: requiredUrlString('stationStreamUrl'),
  stationFavicon: normalizedOptionalUrl('stationFavicon'),
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
  };
}

router.get("/", async (c) => {
  const user = getAuthenticatedUser(c);

  const rows = await db
    .select()
    .from(listeningHistory)
    .where(eq(listeningHistory.userId, user.id))
    .orderBy(desc(listeningHistory.listenedAt));

  return c.json(ok(rows.map(toHistory)));
});

router.post('/', vValidator('json', createHistorySchema, validationHook), async (c) => {
  const user = getAuthenticatedUser(c);
  const parsed = c.req.valid('json')

  const now = new Date();
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
  } satisfies typeof listeningHistory.$inferInsert;

  await db.insert(listeningHistory).values(row);

  return c.json(ok(toHistory(row)), 201);
});

export { router as historyRouter };
