import type { ArtistSearchResult, Station } from '@tunes/types'
import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref, watch } from 'vue'
import type { GenreDefinition } from '@/features/genres'
import { runGlobalSearch, searchGenres } from '@/features/search/run-global-search'
import { useToastStore } from '@/stores/toast'

export type SearchTab = 'stations' | 'artists' | 'genres'

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

export const useSearchStore = defineStore('search', () => {
  const isOpen = ref(false)
  const query = ref('')
  const debouncedQuery = ref('')
  const activeTab = ref<SearchTab>('stations')
  const stationResults = ref<Station[]>([])
  const artistResults = ref<ArtistSearchResult[]>([])
  const genreResults = ref<GenreDefinition[]>([])
  const isLoading = ref(false)
  const hasSettled = ref(false)
  const error = ref<string | null>(null)
  let debounceTimer: ReturnType<typeof setTimeout> | null = null
  let requestId = 0

  const isActive = computed(() => debouncedQuery.value.trim().length >= MIN_QUERY_LENGTH)
  const hasResults = computed(
    () =>
      stationResults.value.length > 0 ||
      artistResults.value.length > 0 ||
      genreResults.value.length > 0,
  )

  const tabCounts = computed<Record<SearchTab, number>>(() => ({
    stations: stationResults.value.length,
    artists: artistResults.value.length,
    genres: genreResults.value.length,
  }))

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function clearResults() {
    stationResults.value = []
    artistResults.value = []
    genreResults.value = []
    error.value = null
    isLoading.value = false
    hasSettled.value = false
  }

  function reset() {
    query.value = ''
    debouncedQuery.value = ''
    activeTab.value = 'stations'
    clearResults()
  }

  async function search(term: string) {
    const normalizedTerm = term.trim()
    const currentRequestId = ++requestId

    if (normalizedTerm.length < MIN_QUERY_LENGTH) {
      clearResults()
      return
    }

    error.value = null
    isLoading.value = true
    hasSettled.value = false
    stationResults.value = []
    artistResults.value = []
    genreResults.value = searchGenres(normalizedTerm)

    const results = await runGlobalSearch(normalizedTerm)

    if (currentRequestId !== requestId) {
      return
    }

    stationResults.value = results.stations
    artistResults.value = results.artists
    genreResults.value = results.genres

    if (results.errors.length > 0) {
      error.value = results.errors.map((searchError) => searchError.message).join(' ')

      useToastStore().infrastructureError(error.value, 'search-infrastructure')
    }

    isLoading.value = false
    hasSettled.value = true
  }

  watch(query, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value
    }, DEBOUNCE_MS)
  })

  watch(debouncedQuery, (value) => {
    void search(value)
  })

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  return {
    isOpen,
    query,
    debouncedQuery,
    activeTab,
    stationResults,
    artistResults,
    genreResults,
    isLoading,
    hasSettled,
    error,
    isActive,
    hasResults,
    tabCounts,
    open,
    close,
    reset,
    search,
  }
})
