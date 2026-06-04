# `apps/frontend` — Vue 3 SPA

The Tunez client. A Vue 3.5 + TypeScript single-page app built with Vite, with Pinia for state, TanStack Vue Query for async data, and SCSS for styling. Talks to the Hono backend in `apps/backend`.

See the [root README](../../README.md) for the full architecture overview.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm --filter vue-frontend dev` | Vite dev server (default `http://localhost:5173`) |
| `pnpm --filter vue-frontend build` | Type-check then production build |
| `pnpm --filter vue-frontend preview` | Serve the production build locally |
| `pnpm --filter vue-frontend type-check` | `vue-tsc --build` (project references: `tsconfig.app.json` + `tsconfig.node.json`) |
| `pnpm --filter vue-frontend lint` | Runs `lint:oxlint` then `lint:eslint` |
| `pnpm --filter vue-frontend format` | `oxfmt src/` |

Engines: Node `^20.19.0 || >=22.12.0` (per `package.json`).

## Environment variables

Copy `apps/frontend/.env.example` → `apps/frontend/.env` and adjust as needed.

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_APP_NAME` | optional | Display name; defaults to `Tunez` |
| `VITE_APP_ENV` | optional | Free-form environment label |
| `VITE_API_BASE_URL` | dev only | Backend origin used in development. **Do not set this in Vercel production** — production builds call same-origin `/api/*` and rely on `vercel.json` rewrites so Better Auth cookies remain first-party. |
| `VITE_ENABLE_DEBUG_TOOLS` | optional | Enables the Vue DevTools panel and other debug aids |

### Backend URL resolution

`src/lib/backend-url.ts` is the single source of truth for backend URLs:

- **Dev** — `buildBackendUrl(path)` returns `http://localhost:3000/path` by default, or whatever `VITE_API_BASE_URL` resolves to (with trailing slashes stripped). The Better Auth client uses the same URL as `AUTH_BASE_URL`.
- **Prod** — `buildBackendUrl(path)` returns the same-origin `/path`. The frontend's `vercel.json` rewrites those requests to the backend Vercel domain.

## Local development

```bash
pnpm --filter vue-frontend dev
# Vite serves on http://localhost:5173
# The app calls the backend at http://localhost:3000 by default
```

Make sure the backend is running (`pnpm --filter hono-backend dev`) — the SPA does not proxy backend requests in dev, so it calls the backend directly.

## Authentication

The Better Auth Vue client is created in `src/lib/auth-client.ts` with the `anonymousClient` plugin. `ensureAnonymousSession()` is called once from `main.ts` at app boot; the underlying promise is module-scoped, so concurrent callers share the same request. The store-level composables (`stores/favorites`, `stores/history`) call it defensively before any protected request, and the persistent player and history hooks use the auth client when reading the session.

## Routes

Defined in `src/router/index.ts`:

| Path | Name | Notes |
| --- | --- | --- |
| `/` | `home` | Curated feed (trending + recent + favorites rails) |
| `/radio` | `radio` | Station list + search |
| `/radio/:id` | `station-detail` | Station detail page with the persistent player |
| `/artists` | `artists` | Last.fm artist search, debounced |
| `/artists/:name` | `artists-detail` | Artist bio, image, similar artists |
| `/artists/:name/discography` | `artist-discography` | Top albums |
| `/genres` | `genres` | Genre tiles |
| `/genres/:id` | `genre-detail` | Router guard rejects unknown ids via `getGenreById` |
| `/favorites` | `favorites` | Per-user favorite stations |
| `/profile` | `profile` | Stats cards, top stations, recent activity |

## State (Pinia)

- `stores/audio` — current station, play/pause, volume (0–1), error and retry counter. Source of truth for the `<audio>` element; the DOM is synced from the store (one-way).
- `stores/favorites` — optimistic pending entries (so the heart toggles immediately), a `hasLoaded` flag, load-once dedupe via a module-scoped promise.
- `stores/history` — recent entries with cursor pagination support.
- `stores/search` — global search dialog state.
- `stores/toast` — toast notifications.
- `stores/counter` — a small counter example used as a Pinia reference.

## Data fetching

TanStack Vue Query composables in `src/composables/` wrap the API client (`src/lib/api.ts`), which itself wraps `fetch` and unwraps the backend's `ApiResponse<T>` envelope, throwing `ApiError` on failure.

- Stations: `useStations`, `useStation(id)`, `useStationSearch`.
- Artists: `useArtist(name)`, `useArtistSearch`, `useArtistAlbums(name)`, `useArtistSimilar(name)`.
- Genres: `useGenres`, `useGenreDetail(id)`.
- Audio + history: `useAudio`, `useListeningHistory`, `useDebouncedSearchQuery`.

`@/*` is aliased to `src/*` (see `tsconfig.app.json` and `vite.config.ts`).

## Persistent audio player

`features/shell/persistent-player.vue` is rendered once inside `AppLayout` (in `App.vue`) and stays mounted across navigations.

- `useAudio` owns the `<audio>` element, syncing `src`, `volume`, and play/pause from the audio store to the DOM (one-way, never the reverse). Failed streams retry up to 2× with a 3 s backoff before pausing with a "Station offline" error.
- `useListeningHistory` watches the audio store and records any session that played for at least 5 seconds as a `ListeningHistory` row.

## Genres

The genre taxonomy is local to the frontend:

- `features/genres/genre-data.ts` defines the six genres (Benga, Gengetone, Afro-pop, Genge, Taarab, Bongo-flava) with descriptions, hero copy, accent colors, featured artists, and `tagAliases`.
- `features/genres/index.ts` exposes `matchStationToGenre` and `getStationsForGenre`, which tokenize a station's tags and name and match them against each genre's alias set. This is how the genre detail page knows which stations to list.

## Styling

- Global design system: `src/shared/styles/` (variables, typography, layout primitives).
- Per-feature styles live alongside the feature (`features/*/styles/`) and are loaded with SCSS `@use`.
- Component-level styles are `<style scoped lang="scss">`.
- Tailwind is **not** used.

## Linting and formatting

- `oxlint` (`lint:oxlint`) — fast lint, runs first.
- `eslint` (`lint:eslint`) — Vue-aware linting with `@vue/eslint-config-typescript` and `eslint-plugin-vue`.
- `oxfmt` (`format`) — formatter, scoped to `src/`.
- Prettier is installed as a peer of `eslint-config-prettier` but is not the project's formatter.

## Deployment

The frontend deploys to Vercel. `vercel.json` rewrites `/api/*` to the backend Vercel domain (currently `https://tunez-backend-zep6.vercel.app/api/$1`) and falls back to `/index.html` for SPA routing.

Important operational notes:

- `VITE_API_BASE_URL` must not be set in Vercel production — production builds must use the same-origin rewrite path.
- If the backend Vercel domain changes, update the `dest` in `vercel.json` and redeploy the frontend.
- The Better Auth client uses `credentials: 'include'` on all requests so the session cookie travels through the rewrite.
