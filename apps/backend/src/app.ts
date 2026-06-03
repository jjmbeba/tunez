import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth.js";
import { getTrustedOrigins } from "./lib/env.js";
import type { AppBindings } from "./middleware/auth.js";
import { artistsRouter } from "./routes/artists.js";
import { favoritesRouter } from "./routes/favorites.js";
import { historyRouter } from "./routes/history.js";
import { lyricsRouter } from "./routes/lyrics.js";
import { profileRouter } from "./routes/profile.js";
import { stationsRouter } from "./routes/stations.js";

const app = new Hono<AppBindings>();

app.use(
  "*",
  cors({
    origin: getTrustedOrigins(),
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
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

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/stations", stationsRouter);
app.route("/api/artists", artistsRouter);
app.route("/api/lyrics", lyricsRouter);
app.route("/api/favorites", favoritesRouter);
app.route("/api/history", historyRouter);
app.route("/api/profile", profileRouter);

export default app;
