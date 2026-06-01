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
