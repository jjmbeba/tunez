import { useDebouncedSearchQuery } from '@/composables/use-debounced-search-query'
import { get } from '@/lib/api'
import { useQuery } from '@tanstack/vue-query'
import type { Station } from '@tunes/types'

export function useStationSearch() {
  const { query, debouncedQuery, isActive: showResults } = useDebouncedSearchQuery()

  const queryResult = useQuery({
    queryKey: ['station-search', debouncedQuery],
    queryFn: async () => {
      return await get<Station[]>(`/stations/search?q=${encodeURIComponent(debouncedQuery.value)}`)
    },
    enabled: showResults,
  })

  return { query, debouncedQuery, showResults, ...queryResult }
}
