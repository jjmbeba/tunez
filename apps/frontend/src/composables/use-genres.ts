import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import { getGenreById, listGenres } from '@/features/genres'

export function useGenres() {
  return computed(() => listGenres())
}

export function useGenre(genreId: MaybeRefOrGetter<string>) {
  return computed(() => getGenreById(toValue(genreId)))
}
