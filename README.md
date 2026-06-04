# Tunez

A mobile-first radio streaming web app — browse live stations, save favorites, track listening history, and explore artists and genres. Built as a Vue 3 SPA talking to a Hono API, with anonymous auth so every visitor can use the personal features without signing up.

## Features

- **Radio discovery** — station list and search powered by the community [Radio Browser](https://www.radio-browser.info/) directory, with an in-memory TTL cache on the server.
- **Favorites** — save stations per user; optimistic updates in the UI with idempotent server writes.
- **Listening history** — sessions of at least 5 seconds are recorded; profile page surfaces total listens, total listening time, and a top-3 stations leaderboard.
- **Artist pages** — search, detail, similar artists, and top albums via [Last.fm](https://www.last.fm/api).
- **Genre explorer** — local taxonomy (Benga, Gengetone, Afro-pop, Genge, Taarab, Bongo-flava) with alias-based matching against station tags.
- **Anonymous auth** — every visitor gets a Better Auth session at app boot, no sign-up screen required.

## Tech stack

| Concern | Choice |
| --- | --- |
| Frontend framework | Vue 3.5 (Composition API, `<script setup>`) |
| State management | Pinia 3 (domain stores) |
| Routing | Vue Router 5 |
| Async data | TanStack Vue Query 5 |
| Build tool | Vite 8 |
| Styling | SCSS with a global design system + scoped per-feature overrides |
| Lint / format | oxlint, ESLint, oxfmt |
| Backend | Hono 4 on Node |
| Auth | Better Auth 1.6 (anonymous sessions) |
| Database | Drizzle ORM + libSQL (SQLite locally, Turso in prod) |
| Validation | valibot via `@hono/valibot-validator` |
| Shared types | `@tunes/types` workspace package |
| Package manager | pnpm 11 (workspaces) |

## Repository layout

```
tunez/
├── apps/
│   ├── frontend/          # Vue 3 SPA (vue-frontend)
│   └── backend/           # Hono API (hono-backend)
├── packages/
│   └── types/             # Shared TypeScript interfaces (@tunes/types)
├── pnpm-workspace.yaml
└── package.json           # Root workspace config
```

Inside `apps/frontend/src/`:

- `features/` — feature-based modules: `home`, `radio`, `artists`, `genres`, `favorites`, `profile`, `search`, `shell`. Each holds its own `components/`, optional `composables/`, optional `lib/`, and `styles/`.
- `pages/` — thin route entry points wired in `router/index.ts`.
- `composables/` — cross-feature data hooks (stations, artists, history, etc.).
- `stores/` — Pinia stores (`audio`, `favorites`, `history`, `search`, `toast`).
- `lib/` — fetch wrapper, Better Auth client, backend URL builder.
- `shared/` — design system SCSS, cross-feature components, shared types.
- `router/` — route table.

Inside `apps/backend/src/`:

- `app.ts` — Hono app, CORS, route mounting, `/api/health`.
- `auth.ts` — Better Auth instance with the `anonymous()` plugin.
- `db/` — Drizzle schema split into `auth-schema.ts` (Better Auth) and `app-schema.ts` (app-owned tables).
- `lib/` — external API clients (`radio-browser`, `lastfm`, `lyrics`), `TtlCache`, valibot rules, response envelope helpers, cursor pagination, env helpers.
- `middleware/auth.ts` — `requireAuth` / `optionalAuth` / `getAuthenticatedUser` and the shared `AppBindings` type.
- `routes/` — one router per resource (`stations`, `artists`, `lyrics`, `favorites`, `history`, `profile`).
- `dev.ts` — local entrypoint that starts `@hono/node-server` on port 3000.
- `index.ts` — re-exports the app for Vercel.

## Prerequisites

- Node `^20.19.0` or `>=22.12.0` (per `apps/frontend/package.json#engines`)
- pnpm 11.3.0 (the repo pins `packageManager: pnpm@11.3.0` at the root)

## Quick start

```bash
pnpm install

# Backend env
cp apps/backend/.env.example apps/backend/.env
# edit apps/backend/.env and fill in BETTER_AUTH_SECRET, LASTFM_API_KEY, etc.

# Frontend env (optional — defaults work for local dev)
cp apps/frontend/.env.example apps/frontend/.env

# Database: generate Better Auth tables, then push the schema
pnpm --filter hono-backend db:auth:generate
pnpm --filter hono-backend db:push

# Run frontend (:5173) and backend (:3000) together
pnpm dev
```

Open <http://localhost:5173>. The frontend talks to the backend at `http://localhost:3000` by default.

## Scripts

### Root

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs `vue-frontend` and `hono-backend` in parallel via `concurrently` |
| `pnpm build` | Builds every workspace package |
| `pnpm type-check` | Type-checks every workspace |
| `pnpm format` | Formats every workspace |

### Backend (`apps/backend`)

| Command | What it does |
| --- | --- |
| `pnpm --filter hono-backend dev` | Watches `src/dev.ts` with `tsx` on port 3000 |
| `pnpm --filter hono-backend build` | `tsc -p tsconfig.json` into `dist/` |
| `pnpm --filter hono-backend type-check` | `tsc --noEmit` |
| `pnpm --filter hono-backend db:generate` | Generate a Drizzle migration from the schema |
| `pnpm --filter hono-backend db:migrate` | Apply pending migrations to the configured database |
| `pnpm --filter hono-backend db:push` | Push the schema directly (dev convenience, no migration file) |
| `pnpm --filter hono-backend db:studio` | Open Drizzle Studio |
| `pnpm --filter hono-backend db:auth:generate` | Regenerate `src/db/auth-schema.ts` from `src/auth.ts` (Better Auth CLI) |

### Frontend (`apps/frontend`)

| Command | What it does |
| --- | --- |
| `pnpm --filter vue-frontend dev` | Vite dev server (default `:5173`) |
| `pnpm --filter vue-frontend build` | Type-check + production build |
| `pnpm --filter vue-frontend preview` | Serve the production build locally |
| `pnpm --filter vue-frontend type-check` | `vue-tsc --build` (project references) |
| `pnpm --filter vue-frontend lint` | Runs `lint:oxlint` + `lint:eslint` |
| `pnpm --filter vue-frontend format` | `oxfmt src/` |

## Environment variables

### `apps/backend/.env`

| Variable | Required | Notes |
| --- | --- | --- |
| `NODE_ENV` | dev only | `isProductionRuntime()` reads this; prod must set `TURSO_*` and `BETTER_AUTH_TRUSTED_ORIGINS` |
| `PORT` | optional | Defaults to `3000` |
| `RADIO_BROWSER_BASE_URL` | optional | Defaults to `https://de1.api.radio-browser.info` |
| `LASTFM_API_KEY` | yes (in prod) | Used for artist search/info/similar/albums |
| `MUSICBRAINZ_USER_AGENT` | reserved | Present in the example file for future use |
| `TURSO_DATABASE_URL` | yes in prod | Falls back to local `data/tunez.db` in dev |
| `TURSO_AUTH_TOKEN` | when `TURSO_DATABASE_URL` is set | |
| `BETTER_AUTH_SECRET` | yes | Random ≥ 32-char string in prod |
| `BETTER_AUTH_URL` | yes | Public origin of the backend |
| `BETTER_AUTH_TRUSTED_ORIGINS` | yes in prod | Comma-separated list of origins allowed by CORS and Better Auth; dev default is `http://localhost:5173` |

### `apps/frontend/.env`

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_APP_NAME` | optional | Display name; defaults to `Tunez` |
| `VITE_APP_ENV` | optional | Free-form environment label |
| `VITE_API_BASE_URL` | dev only | Backend origin used by `buildBackendUrl`. **Do not set in Vercel production** — production builds use same-origin `/api/*` and rely on `vercel.json` rewrites so Better Auth cookies remain first-party. |
| `VITE_ENABLE_DEBUG_TOOLS` | optional | Toggles extra dev tooling |

## Database

- **Dev** — Drizzle talks to a local libSQL file at `apps/backend/data/tunez.db` (auto-created on first run when no `TURSO_DATABASE_URL` is set).
- **Prod** — Drizzle talks to Turso using `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`. `drizzle.config.ts` auto-selects the right config based on the env vars.
- **Schema split** — `src/db/auth-schema.ts` is **reserved for Better Auth core tables** and is regenerated by `db:auth:generate`. App-owned tables (`favorite`, `listeningHistory`) live in `src/db/app-schema.ts`. Both are re-exported from `src/db/schema.ts`. Keeping them separate ensures the auth generator can never clobber application tables.

## Authentication

Auth is implemented with Better Auth's `anonymous()` plugin. The flow:

1. On frontend boot (`main.ts`), `ensureAnonymousSession()` reads the current session, and if there isn't one, signs the visitor in anonymously. The promise is cached at module scope so subsequent calls are deduped.
2. The Better Auth client uses `credentials: 'include'`, so the session cookie travels with every request.
3. The backend resolves the session in `setAuthContext` (used by both `optionalAuth` and `requireAuth`) and stores `user` / `session` on the Hono context. Protected routes (favorites, history, profile) use `requireAuth` and read the user via `getAuthenticatedUser(c)`.
4. Anonymous users get a real `user.id` row, so favorites and history are scoped per visitor. If the user later upgrades to a real account, that work can be migrated by tying the anonymous row to a real user (out of scope for v1).

## API surface

All endpoints respond with a uniform envelope from `apps/backend/src/lib/response.ts`:

```ts
{ success: true, data: T }   // 2xx
{ success: false, error: string }   // non-2xx
```

| Method | Path | Auth | Source |
| --- | --- | --- | --- |
| `GET` | `/api/health` | — | `app.ts` |
| `GET \| POST` | `/api/auth/*` | — | `auth.handler` |
| `GET` | `/api/stations` | — | Radio Browser (KE), TtlCache 1h |
| `GET` | `/api/stations/search?q=` | — | Radio Browser |
| `GET` | `/api/stations/:id` | — | Radio Browser |
| `GET` | `/api/artists/search?q=&limit=` | — | Last.fm, TtlCache 24h |
| `GET` | `/api/artists/:name` | — | Last.fm |
| `GET` | `/api/artists/:name/similar` | — | Last.fm |
| `GET` | `/api/artists/:name/albums` | — | Last.fm |
| `GET` | `/api/lyrics?artist&title` | — | lyrics.ovh — backend only, not yet wired to the frontend |
| `GET \| POST` | `/api/favorites` | required | `db/app-schema.ts#favorite` |
| `DELETE` | `/api/favorites/:id` | required | |
| `GET` | `/api/history?limit&cursor` | required | Cursor-paginated |
| `POST` | `/api/history` | required | |
| `GET` | `/api/profile/stats` | required | Aggregates + top-3 stations |

## Frontend architecture

- **Pages** (one per route in `src/router/index.ts`): `Home`, `Radio`, `Radio detail`, `Artists`, `Artist detail`, `Artist discography`, `Genres`, `Genre detail` (router guard rejects unknown ids), `Favorites`, `Profile`.
- **Persistent audio player** — `features/shell/persistent-player.vue` renders once inside `AppLayout` and stays mounted across navigations. `useAudio` owns the `<audio>` element, syncs one-way from the audio store to the DOM, and retries failed streams up to 2× with a 3 s backoff before pausing with a "Station offline" error.
- **Listening history** — `useListeningHistory` watches the audio store and records any session that played for at least 5 seconds as a `ListeningHistory` row.
- **Pinia stores** — `audio` (current station, play/pause, volume, error/retry), `favorites` (optimistic pending entries + load-once dedupe), `history` (recent + cursor pagination), `search`, `toast`.
- **Vue Query** — feature composables in `src/composables/` wrap `useQuery` for stations, station search, artist search/detail/similar/albums, genres, and listening history. All requests go through `src/lib/api.ts`, which unwraps the `ApiResponse<T>` envelope and throws `ApiError` on failure.
- **Genres** — `features/genres/genre-data.ts` defines the local taxonomy with `tagAliases`. `features/genres/index.ts` exposes `matchStationToGenre` and `getStationsForGenre`, which tokenize a station's tags and name and match them against the alias set.

## Deployment

The app is deployed to Vercel as **two projects**:

1. **Backend** — Hono app, deployed from `apps/backend`. The entry is `src/index.ts`, which re-exports the Hono app built in `src/app.ts`. Local development still uses `src/dev.ts` + `@hono/node-server`.
2. **Frontend** — Vue build, deployed from `apps/frontend`. `apps/frontend/vercel.json` rewrites `/api/*` to the backend Vercel domain and falls back to `/index.html` for SPA routing. This keeps Better Auth cookies first-party.

Important operational notes:

- Do not reintroduce an `api/[...route].ts` entrypoint that uses `@hono/node-server/vercel` — it caused production 500s (`outgoing.writeHead is not a function`) on `/api/health` in the past. The current `src/index.ts` re-export is the supported path.
- If the backend Vercel domain changes, update `dest` in `apps/frontend/vercel.json` and redeploy the frontend.
- `BETTER_AUTH_TRUSTED_ORIGINS` must list the frontend's public origin in production (the backend throws at request time if it is missing while `NODE_ENV=production`).

## Per-app docs

- [`apps/frontend/README.md`](apps/frontend/README.md) — frontend dev workflow, environment, and conventions.
- [`apps/backend/README.md`](apps/backend/README.md) — backend routes, env vars, database, and deployment details.

## License

ISC (per the root `package.json`).
