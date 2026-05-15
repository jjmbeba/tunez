import type { ApiResponse, Station } from "@tunes/types";
import { Hono } from "hono";
import { TtlCache } from "../lib/cache.js";
import * as radioBrowser from "../lib/radio-browser.js";
import type { RadioBrowserStation } from "../lib/radio-browser.types.js";

const router = new Hono();
const cache = new TtlCache(60 * 60 * 1000);

function toStation(raw: RadioBrowserStation): Station {
  return {
    id: raw.stationuuid,
    name: raw.name,
    streamUrl: raw.url_resolved || raw.url,
    homepage: raw.homepage,
    favicon: raw.favicon,
    tags: raw.tags
      ? raw.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    countryCode: raw.countrycode,
    language: raw.languagecodes || raw.language,
    votes: raw.votes,
    codec: raw.codec,
    bitrate: raw.bitrate,
    clickCount: raw.clickcount,
  };
}

router.get("/", async (c) => {
  try {
    const cacheKey = "stations:ke";
    const cached = cache.get<Station[]>(cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: cached,
      } satisfies ApiResponse<Station[]>);
    }

    const raw = await radioBrowser.getStationsByCountry("KE");
    const stations = raw.map(toStation);
    cache.set(cacheKey, stations);

    return c.json({
      success: true,
      data: stations,
    } satisfies ApiResponse<Station[]>);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return c.json(
      {
        success: false,
        error: message,
      } satisfies ApiResponse<never>,
      502,
    );
  }
});

router.get("/search", async (c) => {
  try {
    const query = c.req.query("q");

    if (!query || query.length < 2) {
      return c.json({
        success: true,
        data: [],
      } satisfies ApiResponse<Station[]>);
    }

    const raw = await radioBrowser.searchStations(query, "KE");
    const stations = raw.map(toStation);

    return c.json({
      success: true,
      data: stations,
    } satisfies ApiResponse<Station[]>);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return c.json(
      {
        success: false,
        error: message,
      } satisfies ApiResponse<never>,
      502,
    );
  }
});

router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const cacheKey = `station:${id}`;
    const cached = cache.get<Station>(cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: cached,
      } satisfies ApiResponse<Station>);
    }

    const raw = await radioBrowser.getStationById(id);

    if (!raw) {
      return c.json(
        {
          success: false,
          error: "Station not found",
        } satisfies ApiResponse<never>,
        404,
      );
    }

    const station = toStation(raw);
    cache.set(cacheKey, station);

    return c.json({
      success: true,
      data: station,
    } satisfies ApiResponse<Station>);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return c.json(
      {
        success: false,
        error: message,
      } satisfies ApiResponse<never>,
      502,
    );
  }
});

export { router as stationsRouter };
