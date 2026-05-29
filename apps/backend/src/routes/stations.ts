import type { Station } from "@tunes/types";
import { Hono } from "hono";
import { TtlCache } from "../lib/cache.js";
import * as radioBrowser from "../lib/radio-browser.js";
import type { RadioBrowserStation } from "../lib/radio-browser.types.js";
import { ok, fail } from "../lib/response.js";

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
    const stations = await cache.fetch("stations:ke", () =>
      radioBrowser.getStationsByCountry("KE").then((raw) => raw.map(toStation)),
    );

    return c.json(ok(stations));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return c.json(fail(message), 502);
  }
});

router.get("/search", async (c) => {
  try {
    const query = c.req.query("q");

    if (!query || query.length < 2) {
      return c.json(ok([]));
    }

    const raw = await radioBrowser.searchStations(query, "KE");
    const stations = raw.map(toStation);

    return c.json(ok(stations));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return c.json(fail(message), 502);
  }
});

router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const station = await cache.fetch(`station:${id}`, async () => {
      const raw = await radioBrowser.getStationById(id);
      if (!raw) throw new Error("Station not found");
      return toStation(raw);
    });

    return c.json(ok(station));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 502;

    return c.json(fail(message), status);
  }
});

export { router as stationsRouter };
