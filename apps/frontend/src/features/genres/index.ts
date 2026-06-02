import type { Station } from "@tunes/types";
import type { StationCardStation } from "@/features/radio/station-card.types";
import { GENRE_DEFINITIONS } from "./genre-data";
import type { GenreDefinition, GenreId } from "./genre.types";

const genresById = new Map<GenreId, GenreDefinition>(
  GENRE_DEFINITIONS.map((genre) => [genre.id, genre]),
);

export function normalizeGenreToken(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ");
}

function getGenreAliases(genre: GenreDefinition) {
  return new Set([genre.name, ...genre.tagAliases].map(normalizeGenreToken));
}

const genreAliasesById = new Map<GenreId, Set<string>>(
  GENRE_DEFINITIONS.map((genre) => [genre.id, getGenreAliases(genre)]),
);

function getStationTokens(station: Pick<Station, "tags" | "name">) {
  return new Set(station.tags.map(normalizeGenreToken).filter(Boolean));
}

function stationMatchesGenre(station: Pick<Station, "tags" | "name">, genreId: GenreId) {
  const aliases = genreAliasesById.get(genreId);

  if (!aliases) {
    return false;
  }

  const stationTokens = getStationTokens(station);

  for (const alias of aliases) {
    if (stationTokens.has(alias)) {
      return true;
    }
  }

  return false;
}

export function listGenres() {
  return GENRE_DEFINITIONS;
}

export function getGenreById(id: string) {
  return genresById.get(id as GenreId) ?? null;
}

export function matchStationToGenre(station: Pick<Station, "tags" | "name">) {
  return GENRE_DEFINITIONS.find((genre) => stationMatchesGenre(station, genre.id)) ?? null;
}

export function getStationsForGenre(stations: Station[], genreId: GenreId) {
  return stations
    .filter((station) => stationMatchesGenre(station, genreId))
    .sort((left, right) => {
      if (right.clickCount !== left.clickCount) {
        return right.clickCount - left.clickCount;
      }

      if (right.votes !== left.votes) {
        return right.votes - left.votes;
      }

      return left.name.localeCompare(right.name);
    });
}

export function toGenreStationCard(station: Station): StationCardStation {
  return {
    id: station.id,
    name: station.name,
    streamUrl: station.streamUrl,
    favicon: station.favicon,
    tags: station.tags,
    votes: station.votes,
  };
}

export type { GenreDefinition, GenreId };
