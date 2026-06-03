import { get } from '@/lib/api'
import { useQuery } from '@tanstack/vue-query'
import type { Station } from '@tunes/types'
import { computed, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

export function useStation(id: MaybeRefOrGetter<string>) {
  const stationId = computed(() => toValue(id))

  return useQuery({
    queryKey: computed(() => ['station', stationId.value]),
    queryFn: async () => {
      return await get<Station>(`/stations/${encodeURIComponent(stationId.value)}`)
    },
    enabled: computed(() => stationId.value.length > 0),
  })
}
