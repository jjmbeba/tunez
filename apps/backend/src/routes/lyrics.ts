import type { ApiResponse } from "@tunes/types";
import { Hono } from "hono";
import * as lyrics from "../lib/lyrics.js";

const router = new Hono();

router.get("/", async (c) => {
  try {
    const artist = c.req.query("artist");
    const title = c.req.query("title");

    if (!artist || !title) {
      return c.json(
        {
          success: false,
          error: "Both artist and title query parameters are required",
        } satisfies ApiResponse<never>,
        400,
      );
    }

    const text = await lyrics.getLyrics(artist, title);
    if (text === null) {
      return c.json({
        success: true,
        data: { lyrics: null },
      } satisfies ApiResponse<{ lyrics: string | null }>);
    }

    return c.json({
      success: true,
      data: { lyrics: text },
    } satisfies ApiResponse<{ lyrics: string }>);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    return c.json(
      { success: false, error: message } satisfies ApiResponse<never>,
      502,
    );
  }
});

export { router as lyricsRouter };
