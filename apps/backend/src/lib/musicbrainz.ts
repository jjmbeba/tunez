const BASE_URL = "https://musicbrainz.org/ws/2";
const USER_AGENT =
  process.env.MUSICBRAINZ_USER_AGENT ?? "tunez/1.0.0 (unknown)";

let lastRequestTime = 0;

interface MusicbrainzReleaseGroup {
  id: string;
  title: string;
  "primary-type": string;
  "first-release-date": string;
  "secondary-types": string[];
}

interface ReleaseGroupResponse {
  "release-groups": MusicbrainzReleaseGroup[];
  "release-group-count": number;
}

async function rateLimit(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;

  if (elapsed < 1100) {
    await new Promise((resolve) => setTimeout(resolve, 1100 - elapsed));
  }

  lastRequestTime = Date.now();
}

async function fetchJson<T>(path: string): Promise<T> {
  await rateLimit();

  const url = new URL(path, BASE_URL);
  url.searchParams.set("fmt", "json");

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(
      `MusicBrainz API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getArtistReleaseGroups(
  mbid: string,
  limit = 50,
): Promise<MusicbrainzReleaseGroup[]> {
  const data = await fetchJson<ReleaseGroupResponse>(
    `/release-group?artist=${mbid}&limit=${limit}`,
  );

  return data["release-groups"];
}
