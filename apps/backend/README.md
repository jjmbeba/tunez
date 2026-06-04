Prerequisites:

- [Vercel CLI](https://vercel.com/docs/cli) installed globally

Database and auth helpers:

```bash
pnpm --filter hono-backend db:auth:generate
pnpm --filter hono-backend db:push
```

`db:auth:generate` only writes Better Auth core tables to `src/db/auth-schema.ts`.
Keep app-owned tables in `src/db/app-schema.ts`.

To develop locally:

```bash
npm install
vc dev
```

```bash
open http://localhost:3000
```

To build locally:

```bash
npm install
vc build
```

To deploy:

```bash
npm install
vc deploy
```

## Vercel deployment model

The backend project is deployed as a Hono app from the default export in
`src/index.ts`, which re-exports the app built in `src/app.ts`. Local
development still runs `src/dev.ts`, which starts `@hono/node-server`.

Do not restore the previous `api/[...route].ts` entrypoint that used
`@hono/node-server/vercel` without retesting production first. That adapter
path caused production 500s with `outgoing.writeHead is not a function` on
`/api/health`.

The frontend production app calls same-origin `/api/*` routes. The frontend
Vercel project rewrites those requests to this backend in
`apps/frontend/vercel.json`, which keeps Better Auth requests browser-visible
on the frontend domain. If the backend Vercel domain changes, update the
frontend rewrite destination and redeploy the frontend.
