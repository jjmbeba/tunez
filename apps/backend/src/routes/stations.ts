import type { Station } from "@tunes/types";
import { Hono } from "hono";
import { TtlCache } from "../lib/cache.js";
import * as radioBrowser from "../lib/radio-browser.js";
import type { RadioBrowserStation } from "../lib/radio-browser.types.js";
import { ok, fail } from "../lib/response.js";
import { CURATED_STATIONS } from "../data/curated-stations.js";

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

function dedupeByName(stations: Station[]): Station[] {
  const seen = new Set<string>();

  return stations.filter((s) => {
    const key = s.name.toLowerCase().replace(/\s+/g, " ").trim();

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

router.get("/", async (c) => {
  let radioBrowserStations: Station[] = [];

  try {
    radioBrowserStations = await cache.fetch("stations:ke", () =>
      radioBrowser.getStationsByCountry("KE").then((raw) => raw.map(toStation)),
    );
  } catch {
    // Radio Browser unavailable — serve curated stations only
  }

  const merged = dedupeByName([...CURATED_STATIONS, ...radioBrowserStations]);

  return c.json(ok(merged));
});

router.get("/search", async (c) => {
  const query = c.req.query("q")?.trim();

  if (!query || query.length < 2) {
    return c.json(ok([]));
  }

  const lowerQuery = query.toLowerCase();

  const curatedHits = CURATED_STATIONS.filter((s) =>
    s.name.toLowerCase().includes(lowerQuery),
  );

  let radioBrowserHits: Station[] = [];

  try {
    const raw = await radioBrowser.searchStations(query, "KE");
    radioBrowserHits = raw.map(toStation);
  } catch {
    // Radio Browser unavailable — serve curated results only
  }

  return c.json(ok(dedupeByName([...curatedHits, ...radioBrowserHits])));
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const curated = CURATED_STATIONS.find((s) => s.id === id);

  if (curated) {
    return c.json(ok(curated));
  }

  try {
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
