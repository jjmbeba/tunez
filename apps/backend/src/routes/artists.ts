import type { Album, ApiResponse, Artist, ArtistBrief } from "@tunes/types";
import { Hono } from "hono";
import { TtlCache } from "../lib/cache.js";
import * as lastfm from "../lib/lastfm.js";
import type { LastfmArtistResponse } from "../lib/lastfm.types.js";
import * as musicbrainz from "../lib/musicbrainz.js";

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

router.get("/:name", async (c) => {
  try {
    const name = c.req.param("name");
    const cacheKey = `artist:${name.toLowerCase()}`;
    const cached = cache.get<Artist>(cacheKey);

    if (cached) {
      return c.json({
        success: true,
        data: cached,
      } satisfies ApiResponse<Artist>);
    }

    const raw = await lastfm.getArtistInfo(name);
    const artist = toArtist(raw.artist);
    cache.set(cacheKey, artist);

    return c.json({
      success: true,
      data: artist,
    } satisfies ApiResponse<Artist>);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = message.includes("not found") ? 404 : 502;

    return c.json(
      { success: false, error: message } satisfies ApiResponse<never>,
      status,
    );
  }
});

router.get("/:name/similar", async (c) => {
  try {
    const name = c.req.param("name");
    const cacheKey = `artist:${name.toLowerCase()}:similar`;
    const cached = cache.get<ArtistBrief[]>(cacheKey);

    if (cached) {
      return c.json({ success: true, data: cached } satisfies ApiResponse<
        ArtistBrief[]
      >);
    }

    const raw = await lastfm.getSimilarArtists(name);
    const similar: ArtistBrief[] = raw.similarartists.artist.map((a) => ({
      name: a.name,
      image: pickImage(a.image),
      url: a.url,
    }));
    cache.set(cacheKey, similar);

    return c.json({ success: true, data: similar } satisfies ApiResponse<
      ArtistBrief[]
    >);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(
      { success: false, error: message } satisfies ApiResponse<never>,
      502,
    );
  }
});

router.get("/:name/albums", async (c) => {
  try {
    const name = c.req.param("name");
    const cacheKey = `artist:${name.toLowerCase()}:albums`;
    const cached = cache.get<Album[]>(cacheKey);

    if (cached) {
      return c.json({ success: true, data: cached } satisfies ApiResponse<
        Album[]
      >);
    }

    const raw = await lastfm.getTopAlbums(name);

    const albums: Album[] = raw.topalbums.album.map((a) => ({
      id: a.mbid,
      title: a.name,
      type: "Album" as const,
      releaseYear: null,
      image: pickImage(a.image),
    }));

    cache.set(cacheKey, albums);

    return c.json({ success: true, data: albums } satisfies ApiResponse<
      Album[]
    >);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json(
      { success: false, error: message } satisfies ApiResponse<never>,
      502,
    );
  }
});

export { router as artistsRouter };
