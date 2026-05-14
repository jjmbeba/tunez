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

export default app;
