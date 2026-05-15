const BASE_URL = "https://api.lyrics.ovh/v1";

interface LyricsResponse {
  lyrics: string;
}

export async function getLyrics(
  artist: string,
  title: string,
): Promise<string | null> {
  const url = `${BASE_URL}/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "tunez/1.0.0" },
  });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error(
      `Lyrics.ovh error: ${response.status} ${response.statusText}`,
    );
  }

  const body = (await response.json()) as LyricsResponse;
  return body.lyrics;
}
