import type { RadioBrowserStation } from "./radio-browser.types.js";

const BASE_URL =
  process.env.RADIO_BROWSER_BASE_URL ?? "https://de1.api.radio-browser.info";

async function fetchJson<T>(path: string): Promise<T> {
  const url = new URL(path, BASE_URL);
  const response = await fetch(url, {
    headers: {
      "User-Agent": "tunez/1.0.0",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Radio Browser API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getStationsByCountry(
  countryCode: string,
): Promise<RadioBrowserStation[]> {
  const data = await fetchJson<RadioBrowserStation[]>(
    `/json/stations/bycountrycodeexact/${countryCode}?order=clickcount&reverse=true`,
  );
  return data;
}

export async function searchStations(
  query: string,
  countryCode?: string,
): Promise<RadioBrowserStation[]> {
  const params = new URLSearchParams({
    name: query,
    order: "clickcount",
    reverse: "true",
  });

  if (countryCode) {
    params.set("countrycode", countryCode);
  }

  return fetchJson<RadioBrowserStation[]>(`/json/stations/search?${params}`);
}

export async function getStationById(
  id: string,
): Promise<RadioBrowserStation | undefined> {
  const stations = await fetchJson<RadioBrowserStation[]>(
    `/json/stations/byuuid/${id}`,
  );

  return stations[0];
}
