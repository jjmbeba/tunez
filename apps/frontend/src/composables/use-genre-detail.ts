import { computed } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useGenre } from '@/composables/use-genres'
import { useStations } from '@/composables/use-stations'
import {
  getGenreById,
  getStationsForGenre,
  toGenreStationCard,
  type GenreDefinition,
} from '@/features/genres'

export function useGenreDetail(genreId: MaybeRefOrGetter<string>) {
  const genre = useGenre(genreId)
  const stationsQuery = useStations()

  const topStations = computed(() => {
    const genreValue = genre.value
    const stations = stationsQuery.data.value

    if (!genreValue || !stations) {
      return []
    }

    return getStationsForGenre(stations, genreValue.id).map(toGenreStationCard)
  })

  const relatedGenres = computed(() => {
    const genreValue = genre.value

    if (!genreValue) {
      return []
    }

    return genreValue.relatedGenreIds
      .map((id) => getGenreById(id))
      .filter((item): item is GenreDefinition => item !== null)
  })

  const featuredArtists = computed(() => genre.value?.featuredArtists ?? [])
  const resolvedGenreId = computed(() => toValue(genreId))

  return {
    genre,
    resolvedGenreId,
    topStations,
    relatedGenres,
    featuredArtists,
    ...stationsQuery,
  }
}
