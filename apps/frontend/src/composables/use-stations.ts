import { get } from '@/lib/api'
import { useQuery } from '@tanstack/vue-query'
import type { Station } from '@tunes/types'

export function useStations() {
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      return await get<Station[]>('/stations')
    },
  })
}
