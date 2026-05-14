import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

const welcomeStrings = [
  "Hello Hono!",
  "To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono",
];

app.get("/", (c) => {
  return c.text(welcomeStrings.join("\n\n"));
});

app.get("/api/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

const port = Number(process.env.PORT ?? 3000);
console.log(`Backend listening on http://localhost:${port}`);
serve({
  fetch: app.fetch,
  port,
});

export default app;
