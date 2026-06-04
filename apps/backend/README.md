# `apps/backend` — Hono API

The backend for Tunez. A Hono 4 app on Node that proxies the Radio Browser, Last.fm, and lyrics.ovh APIs in front of an in-process libSQL/Turso database, and wires up Better Auth with anonymous sessions.

See the [root README](../../README.md) for the full architecture overview.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm --filter hono-backend dev` | `tsx watch src/dev.ts` — local Hono server on port `3000` |
| `pnpm --filter hono-backend build` | `tsc -p tsconfig.json` into `dist/` |
| `pnpm --filter hono-backend type-check` | `tsc --noEmit` |
| `pnpm --filter hono-backend db:generate` | Generate a Drizzle migration from `src/db/schema.ts` |
| `pnpm --filter hono-backend db:migrate` | Apply pending migrations to the configured database |
| `pnpm --filter hono-backend db:push` | Push the schema directly (no migration file; dev convenience) |
| `pnpm --filter hono-backend db:studio` | Open Drizzle Studio |
| `pnpm --filter hono-backend db:auth:generate` | Regenerate `src/db/auth-schema.ts` from `src/auth.ts` using the Better Auth CLI |

## Environment variables

Copy `apps/backend/.env.example` → `apps/backend/.env` and fill in the required values.

| Variable | Required | Notes |
| --- | --- | --- |
| `NODE_ENV` | dev only | Read by `isProductionRuntime()`; must be `production` in deployed env |
| `PORT` | optional | Defaults to `3000` |
| `RADIO_BROWSER_BASE_URL` | optional | Defaults to `https://de1.api.radio-browser.info` |
| `LASTFM_API_KEY` | yes | Artist routes return 502 without it |
| `MUSICBRAINZ_USER_AGENT` | reserved | Present in `.env.example`; consumed by future MusicBrainz integration |
| `TURSO_DATABASE_URL` | yes in prod | Falls back to local SQLite in dev |
| `TURSO_AUTH_TOKEN` | when `TURSO_DATABASE_URL` is set | |
| `BETTER_AUTH_SECRET` | yes | Use a long random string in prod |
| `BETTER_AUTH_URL` | yes | Public origin of the backend (e.g. `https://tunez-backend-zep6.vercel.app`) |
| `BETTER_AUTH_TRUSTED_ORIGINS` | yes in prod | Comma-separated list of allowed origins; dev default is `http://localhost:5173` |

## Local development

```bash
pnpm --filter hono-backend dev
# Backend listening on http://localhost:3000
```

`GET http://localhost:3000/api/health` should respond with `{ "success": true, "data": { "status": "ok" } }`.

CORS is configured to allow the dev frontend origin by default. Add your own origin to `BETTER_AUTH_TRUSTED_ORIGINS` if you point the frontend elsewhere.

## Database

`drizzle.config.ts` switches automatically based on environment:

- **No `TURSO_DATABASE_URL`** → SQLite at `apps/backend/data/tunez.db` (auto-created on first run).
- **`TURSO_DATABASE_URL` set** → Turso (libSQL). `TURSO_AUTH_TOKEN` is required.

The schema is split deliberately so the Better Auth generator cannot clobber application tables:

- `src/db/auth-schema.ts` — **reserved for Better Auth core tables** (`user`, `session`, `account`, `verification`). Regenerate with `db:auth:generate`. Do not hand-edit.
- `src/db/app-schema.ts` — application-owned tables, currently `favorite` and `listeningHistory`.
- `src/db/schema.ts` — re-exports both so Drizzle and the app see one unified surface.

After cloning:

```bash
pnpm --filter hono-backend db:auth:generate   # writes auth-schema.ts
pnpm --filter hono-backend db:push             # creates tables in the local SQLite db
```

## Authentication

Configured in `src/auth.ts` with the Better Auth `anonymous()` plugin. The Drizzle adapter is wired up against the same `db` instance used by the rest of the app.

- `GET|POST /api/auth/*` is forwarded to `auth.handler` in `src/app.ts`.
- `src/middleware/auth.ts` provides `requireAuth` and `optionalAuth` middlewares plus the `AppBindings` Hono type, which makes `c.get('user')` and `c.get('session')` typed.
- `getAuthenticatedUser(c)` returns a non-null user after `requireAuth` has run; it throws if called outside that boundary.

Every visitor is issued an anonymous session on first load, which is why favorites, history, and profile stats work without sign-up.

## Route map

All responses use the `ApiResponse<T>` envelope from `@tunes/types` (`{ success: true, data: T }` / `{ success: false, error: string }`). Validation is valibot via `@hono/valibot-validator`; reusable rules live in `src/lib/validation.ts` and field length caps in `src/lib/field-limits.ts`.

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | Liveness probe |
| `GET\|POST` | `/api/auth/*` | — | Better Auth handler |
| `GET` | `/api/stations` | — | Kenya station list, TtlCache 1 h, KE hardcoded |
| `GET` | `/api/stations/search?q=` | — | Radio Browser search, optionally scoped to KE |
| `GET` | `/api/stations/:id` | — | Single station by Radio Browser UUID |
| `GET` | `/api/artists/search?q=&limit=` | — | Last.fm artist search |
| `GET` | `/api/artists/:name` | — | Artist info (bio, stats, tags, similar) |
| `GET` | `/api/artists/:name/similar` | — | Similar artists |
| `GET` | `/api/artists/:name/albums` | — | Top albums |
| `GET` | `/api/lyrics?artist&title` | — | lyrics.ovh; returns `{ lyrics: null }` on a 404. **Backend only — not yet wired to the frontend.** |
| `GET` | `/api/favorites` | required | Current user's favorites, newest first |
| `POST` | `/api/favorites` | required | Idempotent on `userId + stationId`; returns the persisted row |
| `DELETE` | `/api/favorites/:id` | required | Returns 404 if the favorite isn't owned by the user |
| `GET` | `/api/history?limit&cursor` | required | Cursor-paginated, default 50, max 200 |
| `POST` | `/api/history` | required | Record a listening session |
| `GET` | `/api/profile/stats` | required | Aggregates: favorite count, total listens, total seconds, top 3 stations |

## External integrations

- **`src/lib/radio-browser.ts`** — public Radio Browser API. Strips `?` from `?order=clickcount&reverse=true` style queries.
- **`src/lib/lastfm.ts`** — Last.fm `artist.getInfo`, `artist.getSimilar`, `artist.search`, `artist.getTopAlbums`. Wraps Last.fm error envelopes in a `LastFmError`.
- **`src/lib/lyrics.ts`** — lyrics.ovh. Returns `null` for 404s instead of throwing.

Each of these is wrapped by a `TtlCache` (`src/lib/cache.ts`) that also de-dups in-flight requests. Stations cache for 1 h; artist endpoints cache for 24 h. Caches are in-memory and per-process.

## Caching

`src/lib/cache.ts` exposes a small `TtlCache` with a per-key TTL and single-flight behavior — concurrent fetches for the same key share one promise. There is no cross-process cache; in production each Vercel instance caches independently.

## Deployment

The backend deploys to Vercel. The entry is `src/index.ts`, which re-exports the Hono app from `src/app.ts`. Local development still uses `src/dev.ts` + `@hono/node-server`.

A previous incident is worth keeping in mind: an earlier entrypoint under `api/[...route].ts` used `@hono/node-server/vercel` and produced production 500s with `outgoing.writeHead is not a function` on `/api/health`. Do **not** reintroduce that path.

The frontend Vercel project rewrites `/api/*` to this backend, which keeps Better Auth cookies first-party on the frontend domain. If the backend Vercel domain changes, update the rewrite destination in `apps/frontend/vercel.json` and redeploy the frontend.
