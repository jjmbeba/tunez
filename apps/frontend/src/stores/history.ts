import type { ListeningHistory, PaginatedListeningHistory } from '@tunes/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ensureAnonymousSession } from '@/lib/auth-client'
import { buildBackendUrl } from '@/lib/backend-url'
import { get, post } from '@/lib/api'

export type HistoryEntryInput = Omit<ListeningHistory, 'id' | 'userId' | 'createdAt'>

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export const useHistoryStore = defineStore('history', () => {
  const recentEntries = ref<ListeningHistory[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastRequestedLimit = ref(10)

  function reportError(message: string, errorCause: unknown, options?: { surface?: boolean }) {
    if (options?.surface ?? true) {
      error.value = message
    }

    if (import.meta.env.DEV) {
      console.error(message, errorCause)
    }
  }

  async function fetchRecent(limit = 10) {
    isLoading.value = true
    error.value = null
    lastRequestedLimit.value = limit

    try {
      await ensureAnonymousSession()
      const data = await get<PaginatedListeningHistory>(`/history?limit=${limit}`)
      recentEntries.value = data.items
    } catch (e) {
      error.value = getErrorMessage(e, 'Failed to load listening history')
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function prepend(entry: ListeningHistory) {
    recentEntries.value = [entry, ...recentEntries.value.filter((item) => item.id !== entry.id)].slice(
      0,
      lastRequestedLimit.value,
    )
  }

  async function saveEntry(entry: HistoryEntryInput) {
    error.value = null

    try {
      await ensureAnonymousSession()
      const saved = await post<ListeningHistory>('/history', entry)
      prepend(saved)
      return saved
    } catch (e) {
      reportError(getErrorMessage(e, 'Failed to save listening history'), e)
      throw e
    }
  }

  function saveEntryBestEffort(entry: HistoryEntryInput) {
    void fetch(buildBackendUrl('/api/history'), {
      method: 'POST',
      credentials: 'include',
      keepalive: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    }).catch((errorCause) => {
      reportError('Best-effort listening history save failed during unload.', errorCause, {
        surface: false,
      })
    })
  }

  return {
    recentEntries,
    isLoading,
    error,
    fetchRecent,
    prepend,
    saveEntry,
    saveEntryBestEffort,
  }
})
