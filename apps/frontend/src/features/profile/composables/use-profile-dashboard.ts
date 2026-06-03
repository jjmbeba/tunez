import { useQuery } from '@tanstack/vue-query'
import type { ProfileStats } from '@tunes/types'
import { computed, onMounted } from 'vue'
import { get } from '@/lib/api'
import { useHistoryStore } from '@/stores/history'

const RECENT_HISTORY_LIMIT = 10

export function useProfileDashboard() {
  const historyStore = useHistoryStore()

  const statsQuery = useQuery({
    queryKey: ['profile-stats'],
    queryFn: async () => {
      return await get<ProfileStats>('/profile/stats')
    },
  })

  onMounted(() => {
    void historyStore.fetchRecent(RECENT_HISTORY_LIMIT).catch(() => undefined)
  })

  return {
    stats: statsQuery.data,
    isStatsLoading: statsQuery.isLoading,
    isStatsError: statsQuery.isError,
    statsError: statsQuery.error,
    recentEntries: computed(() => historyStore.recentEntries),
    isRecentLoading: computed(() => historyStore.isLoading),
    recentError: computed(() => historyStore.error),
  }
}
