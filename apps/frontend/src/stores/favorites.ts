import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Favorite } from '@tunes/types'
import { ensureAnonymousSession } from '@/lib/auth-client'
import type { PlayableStation } from '@/features/radio/station-card.types'
import { delete as deleteFavoriteRequest, get, post } from '@/lib/api'

type PendingFavorite = {
  kind: 'pending'
  requestId: string
  stationId: string
  stationName: string
  stationFavicon: string | null
  stationStreamUrl: string
  createdAt: string
}

type FavoriteEntry = Favorite | PendingFavorite
type FavoriteListItem = Pick<
  Favorite,
  'stationId' | 'stationName' | 'stationFavicon' | 'stationStreamUrl' | 'createdAt'
>

function isPersistedFavorite(entry: FavoriteEntry): entry is Favorite {
  return 'id' in entry
}

function toFavoriteListItem(entry: FavoriteEntry): FavoriteListItem {
  return {
    stationId: entry.stationId,
    stationName: entry.stationName,
    stationFavicon: entry.stationFavicon,
    stationStreamUrl: entry.stationStreamUrl,
    createdAt: entry.createdAt,
  }
}

function isMatchingPendingFavorite(entry: FavoriteEntry, requestId: string) {
  return 'kind' in entry && entry.kind === 'pending' && entry.requestId === requestId
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteEntries = ref<FavoriteEntry[]>([])
  const hasLoaded = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pendingStationIds = ref(new Set<string>())
  let loadPromise: Promise<void> | null = null

  const favorites = computed<FavoriteListItem[]>(() => favoriteEntries.value.map(toFavoriteListItem))
  const favoriteStationIds = computed(() => new Set(favoriteEntries.value.map((f) => f.stationId)))

  function isFavorited(stationId: string): boolean {
    return favoriteStationIds.value.has(stationId)
  }

  function isPending(stationId: string): boolean {
    return pendingStationIds.value.has(stationId)
  }

  function setPending(stationId: string, pending: boolean) {
    const next = new Set(pendingStationIds.value)

    if (pending) {
      next.add(stationId)
    } else {
      next.delete(stationId)
    }

    pendingStationIds.value = next
  }

  function clearError() {
    error.value = null
  }

  async function fetchFavorites() {
    isLoading.value = true
    clearError()

    try {
      await ensureAnonymousSession()
      favoriteEntries.value = await get<Favorite[]>('/favorites')
      hasLoaded.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load favorites'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function ensureLoaded() {
    if (hasLoaded.value) return
    if (loadPromise) return await loadPromise

    loadPromise = fetchFavorites().finally(() => {
      loadPromise = null
    })

    return await loadPromise
  }

  async function addFavorite(station: PlayableStation) {
    await ensureAnonymousSession()

    const optimistic: PendingFavorite = {
      kind: 'pending',
      requestId: crypto.randomUUID(),
      stationId: station.id,
      stationName: station.name,
      stationFavicon: station.favicon || null,
      stationStreamUrl: station.streamUrl,
      createdAt: new Date().toISOString(),
    }

    favoriteEntries.value = [optimistic, ...favoriteEntries.value]

    try {
      const saved = await post<Favorite>('/favorites', {
        stationId: station.id,
        stationName: station.name,
        stationFavicon: station.favicon || null,
        stationStreamUrl: station.streamUrl,
      })

      favoriteEntries.value = favoriteEntries.value.map((entry) =>
        isMatchingPendingFavorite(entry, optimistic.requestId) ? saved : entry,
      )
    } catch (e) {
      favoriteEntries.value = favoriteEntries.value.filter(
        (entry) => !isMatchingPendingFavorite(entry, optimistic.requestId),
      )
      throw e
    }
  }

  async function removeFavorite(stationId: string) {
    await ensureAnonymousSession()

    const removed = favoriteEntries.value.find((entry) => entry.stationId === stationId)

    if (!removed || !isPersistedFavorite(removed)) return

    favoriteEntries.value = favoriteEntries.value.filter((entry) => entry !== removed)

    try {
      await deleteFavoriteRequest<Favorite>(`/favorites/${removed.id}`)
    } catch (e) {
      favoriteEntries.value = [removed, ...favoriteEntries.value]
      throw e
    }
  }

  async function toggleFavorite(station: PlayableStation) {
    if (isPending(station.id)) return

    setPending(station.id, true)
    clearError()

    try {
      await ensureLoaded()

      if (isFavorited(station.id)) {
        await removeFavorite(station.id)
      } else {
        await addFavorite(station)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update favorites'
    } finally {
      setPending(station.id, false)
    }
  }

  return {
    favorites,
    hasLoaded,
    isLoading,
    error,
    isFavorited,
    isPending,
    clearError,
    fetchFavorites,
    ensureLoaded,
    toggleFavorite,
  }
})
