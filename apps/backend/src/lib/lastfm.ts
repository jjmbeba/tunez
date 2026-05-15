import type {
  LastfmArtistResponse,
  LastfmSimilarArtists,
} from "./lastfm.types.js";

const BASE_URL = "https://ws.audioscrobbler.com/2.0";
const API_KEY = process.env.LASTFM_API_KEY ?? "";

class LastFmError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "LastFmError";
  }
}

async function callApi<T>(params: Record<string, string>): Promise<T> {
  const url = new URL(BASE_URL);
  url.searchParams.set("api_key", API_KEY);
  url.searchParams.set("format", "json");

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "tunez/1.0.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Last.fm API error: ${response.status} ${response.statusText}`,
    );
  }

  const body = await response.json();

  if (typeof body === "object" && body !== null && "error" in body) {
    throw new LastFmError(body.error, body.message);
  }

  return body as T;
}

export async function getArtistInfo(
  artist: string,
): Promise<LastfmArtistResponse> {
  return callApi<LastfmArtistResponse>({
    method: "artist.getInfo",
    artist,
    autocorrect: "1",
  });
}

export async function getSimilarArtists(
  artist: string,
  limit = 10,
): Promise<LastfmSimilarArtists> {
  return callApi<LastfmSimilarArtists>({
    method: "artist.getSimilar",
    artist,
    limit: limit.toString(),
    autocorrect: "1",
  });
}
