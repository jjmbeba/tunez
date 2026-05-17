import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { artistsRouter } from "./routes/artists.js";
import { lyricsRouter } from "./routes/lyrics.js";
import { stationsRouter } from "./routes/stations.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.get("/api/health", (c) => {
  return c.json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

app.route("/api/stations", stationsRouter);
app.route("/api/artists", artistsRouter);
app.route("/api/lyrics", lyricsRouter);

const port = Number(process.env.PORT ?? 3000);
console.log(`Backend listening on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;
