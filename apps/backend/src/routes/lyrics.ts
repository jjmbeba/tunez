import { Hono } from "hono";
import * as lyrics from "../lib/lyrics.js";
import { ok, fail } from "../lib/response.js";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const artist = c.req.query("artist");
    const title = c.req.query("title");

    if (!artist || !title) {
      return c.json(fail("Both artist and title query parameters are required"), 400);
    }

    const text = await lyrics.getLyrics(artist, title);
    if (text === null) {
      return c.json(ok({ lyrics: null }));
    }

    return c.json(ok({ lyrics: text }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return c.json(fail(message), 502);
  }
});

export { router as lyricsRouter };
