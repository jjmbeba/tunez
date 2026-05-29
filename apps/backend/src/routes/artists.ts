import type { Artist } from "@tunes/types";
import { Hono } from "hono";
import { TtlCache } from "../lib/cache.js";
import * as lastfm from "../lib/lastfm.js";
import type { LastfmArtistResponse } from "../lib/lastfm.types.js";
import { fail, ok } from "../lib/response.js";

const router = new Hono();
const cache = new TtlCache(24 * 60 * 60 * 1000); // 24 hour TTL

function pickImage(images: Array<{ "#text": string; size: string }>): string {
  const sizes = ["mega", "extralarge", "large", "medium", "small"];

  for (const size of sizes) {
    const found = images.find((img) => img.size === size);
    if (found?.["#text"]) return found["#text"].replace("http://", "https://");
  }
  return "";
}

function toArtist(raw: LastfmArtistResponse["artist"]): Artist {
  return {
    name: raw.name,
    mbid: raw.mbid,
    url: raw.url,
    bio: raw.bio?.summary?.replace(/<[^>]+>/g, "") ?? "",
    image: pickImage(raw.image),
    listeners: Number(raw.stats?.listeners ?? 0),
    playCount: Number(raw.stats?.plays ?? 0),
    similar: raw.similar?.artist?.map((a) => a.name) ?? [],
    tags: raw.tags?.tag?.map((t) => t.name) ?? [],
  };
}

router.get("/search", async (c) => {
  try {
    const query = c.req.query("q")?.trim();
    const rawLimit = Number(c.req.query("limit"));
    const limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : 10;

    if (!query || query.length < 2) {
      return c.json(fail("Query must be at least 2 characters"), 400);
    }

    const cacheKey = `artist-search:${query.toLowerCase()}:limit=${limit}`;
    const results = await cache.fetch(cacheKey, () =>
      lastfm.searchArtists(query, limit).then((raw) =>
        raw.results.artistmatches.artist.map((a) => ({
          name: a.name,
          mbid: a.mbid,
          url: a.url,
          image: pickImage(a.image),
          listeners: Number(a.listeners ?? 0),
        })),
      ),
    );

    return c.json(ok(results));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(fail(message), 502);
  }
});

router.get("/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const artist = await cache.fetch(`artist:${name.toLowerCase()}`, () =>
      lastfm.getArtistInfo(name).then((raw) => toArtist(raw.artist)),
    );

    return c.json(ok(artist));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 502;

    return c.json(fail(message), status);
  }
});

router.get("/:name/similar", async (c) => {
  try {
    const name = c.req.param("name");
    const similar = await cache.fetch(`artist:${name.toLowerCase()}:similar`, () =>
      lastfm.getSimilarArtists(name).then((raw) =>
        raw.similarartists.artist.map((a) => ({
          name: a.name,
          image: pickImage(a.image),
          url: a.url,
        })),
      ),
    );

    return c.json(ok(similar));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(fail(message), 502);
  }
});

router.get("/:name/albums", async (c) => {
  try {
    const name = c.req.param("name");
    const albums = await cache.fetch(`artist:${name.toLowerCase()}:albums`, () =>
      lastfm.getTopAlbums(name).then((raw) =>
        raw.topalbums.album.map((a) => ({
          id: a.mbid,
          title: a.name,
          type: "Album" as const,
          releaseYear: null,
          image: pickImage(a.image),
        })),
      ),
    );

    return c.json(ok(albums));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(fail(message), 502);
  }
});

export { router as artistsRouter };
