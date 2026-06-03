import type { ArtistSearchResult, Station } from '@tunes/types'
import { get } from '@/lib/api'
import { listGenres, normalizeGenreToken, type GenreDefinition } from '@/features/genres'

export interface SearchEndpointError {
  source: 'stations' | 'artists'
  message: string
}

export interface GlobalSearchResult {
  stations: Station[]
  artists: ArtistSearchResult[]
  genres: GenreDefinition[]
  errors: SearchEndpointError[]
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Search failed'
}

function genreMatchesQuery(genre: GenreDefinition, normalizedQuery: string) {
  const haystack = [
    genre.id,
    genre.name,
    genre.description,
    genre.heroCopy,
    ...genre.heroLabels,
    ...genre.featuredArtists,
    ...genre.tagAliases,
  ]
    .map(normalizeGenreToken)
    .join(' ')

  return haystack.includes(normalizedQuery)
}

export function searchGenres(query: string) {
  const normalizedQuery = normalizeGenreToken(query)

  if (!normalizedQuery) {
    return []
  }

  return listGenres().filter((genre) => genreMatchesQuery(genre, normalizedQuery))
}

export async function runGlobalSearch(query: string): Promise<GlobalSearchResult> {
  const normalizedQuery = query.trim()
  const genres = searchGenres(normalizedQuery)

  const [stations, artists] = await Promise.allSettled([
    get<Station[]>(`/stations/search?q=${encodeURIComponent(normalizedQuery)}`),
    get<ArtistSearchResult[]>(`/artists/search?q=${encodeURIComponent(normalizedQuery)}&limit=10`),
  ])

  const errors: SearchEndpointError[] = []

  if (stations.status === 'rejected') {
    errors.push({ source: 'stations', message: getErrorMessage(stations.reason) })
  }

  if (artists.status === 'rejected') {
    errors.push({ source: 'artists', message: getErrorMessage(artists.reason) })
  }

  return {
    stations: stations.status === 'fulfilled' ? stations.value : [],
    artists: artists.status === 'fulfilled' ? artists.value : [],
    genres,
    errors,
  }
}
