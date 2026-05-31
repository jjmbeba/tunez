Prerequisites:

- [Vercel CLI](https://vercel.com/docs/cli) installed globally

Database and auth helpers:

```
pnpm --filter hono-backend db:auth:generate
pnpm --filter hono-backend db:push
```

`db:auth:generate` only writes Better Auth core tables to `src/db/auth-schema.ts`.
Keep app-owned tables in `src/db/app-schema.ts`.

To develop locally:

```
npm install
vc dev
```

```
open http://localhost:3000
```

To build locally:

```
npm install
vc build
```

To deploy:

```
npm install
vc deploy
```
