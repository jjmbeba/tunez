<script setup lang="ts">
import type { ArtistSearchResult, Station } from '@tunes/types'
import { computed, nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Disc3, Loader2, Music2, Radio, Search, Tags, X } from 'lucide-vue-next'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import { useSearchStore, type SearchTab } from '@/stores/search'
import type { GenreDefinition } from '@/features/genres'

type CommandItem =
  | { kind: 'stations'; id: string; label: string; meta: string; station: Station }
  | { kind: 'artists'; id: string; label: string; meta: string; artist: ArtistSearchResult }
  | { kind: 'genres'; id: string; label: string; meta: string; genre: GenreDefinition }

const searchStore = useSearchStore()
const router = useRouter()
const inputRef = ref<HTMLInputElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const selectedIndex = ref(0)
const previouslyFocusedElement = ref<HTMLElement | null>(null)

const tabs: Array<{ id: SearchTab; label: string }> = [
  { id: 'stations', label: 'Stations' },
  { id: 'artists', label: 'Artists' },
  { id: 'genres', label: 'Genres' },
]

const currentItems = computed<CommandItem[]>(() => {
  if (searchStore.activeTab === 'stations') {
    return searchStore.stationResults.slice(0, 8).map((station) => ({
      kind: 'stations',
      id: station.id,
      label: station.name,
      meta: station.tags.slice(0, 2).join(' / ') || `${station.votes} votes`,
      station,
    }))
  }

  if (searchStore.activeTab === 'artists') {
    return searchStore.artistResults.slice(0, 8).map((artist) => ({
      kind: 'artists',
      id: artist.mbid || artist.name,
      label: artist.name,
      meta: artist.listeners ? `${artist.listeners.toLocaleString()} listeners` : 'Artist',
      artist,
    }))
  }

  return searchStore.genreResults.map((genre) => ({
    kind: 'genres',
    id: genre.id,
    label: genre.name,
    meta: genre.description,
    genre,
  }))
})

const emptyMessage = computed(() => {
  if (!searchStore.isActive) {
    return 'Try Sauti Sol, Benga, or NRG Radio'
  }

  if (searchStore.isLoading) {
    return 'Searching Tunez'
  }

  return `No ${searchStore.activeTab} found`
})

const shouldShowSkeleton = computed(
  () => searchStore.isLoading && searchStore.activeTab !== 'genres',
)

const shouldShowEmpty = computed(
  () =>
    currentItems.value.length === 0 &&
    !shouldShowSkeleton.value &&
    (!searchStore.isActive || searchStore.hasSettled || searchStore.activeTab === 'genres'),
)

function getFocusableElements() {
  if (!panelRef.value) return []

  return Array.from(
    panelRef.value.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.offsetParent !== null)
}

function closeDialog() {
  searchStore.close()
}

async function selectItem(item: CommandItem) {
  if (item.kind === 'stations') {
    await router.push(`/radio/${encodeURIComponent(item.station.id)}`)
  } else if (item.kind === 'artists') {
    await router.push(`/artists/${encodeURIComponent(item.artist.name)}`)
  } else {
    await router.push(`/genres/${encodeURIComponent(item.genre.id)}`)
  }

  searchStore.close()
}

function selectCurrentItem() {
  const item = currentItems.value[selectedIndex.value]
  if (!item) return

  void selectItem(item)
}

function moveSelection(direction: 1 | -1) {
  if (currentItems.value.length === 0) return

  selectedIndex.value =
    (selectedIndex.value + direction + currentItems.value.length) % currentItems.value.length
}

function handlePanelKeydown(event: KeyboardEvent) {
  const target = event.target instanceof HTMLElement ? event.target : null

  if (event.key === 'Tab') {
    const focusableElements = getFocusableElements()
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (!firstElement || !lastElement) {
      event.preventDefault()
      return
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
      return
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
      return
    }

    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDialog()
    return
  }

  if (target?.closest('.command-panel__close, .command-tabs__button')) {
    return
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    moveSelection(1)
    return
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault()
    moveSelection(-1)
    return
  }

  if (event.key === 'Enter') {
    event.preventDefault()
    selectCurrentItem()
  }
}

function setActiveTab(tab: SearchTab) {
  searchStore.activeTab = tab
  selectedIndex.value = 0
  void nextTick(() => inputRef.value?.focus())
}

watch(
  () => searchStore.isOpen,
  async (isOpen) => {
    if (!isOpen) {
      await nextTick()

      if (previouslyFocusedElement.value?.isConnected) {
        previouslyFocusedElement.value.focus()
      }

      previouslyFocusedElement.value = null
      return
    }

    previouslyFocusedElement.value =
      document.activeElement instanceof HTMLElement ? document.activeElement : null
    selectedIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  },
)

watch(currentItems, () => {
  selectedIndex.value = 0
})
</script>

<template>
  <Teleport to="body">
    <Transition name="search-dialog">
      <div v-if="searchStore.isOpen" class="search-dialog" role="presentation">
        <button
          type="button"
          class="search-dialog__backdrop"
          tabindex="-1"
          aria-label="Close search"
          @click="closeDialog"
        />

        <section
          ref="panelRef"
          class="command-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Search Tunez"
          @keydown="handlePanelKeydown"
        >
          <div class="command-panel__bar">
            <Search stroke-width="1.5" :size="18" class="command-panel__search-icon" />
            <input
              ref="inputRef"
              v-model="searchStore.query"
              class="command-panel__input"
              type="search"
              autocomplete="off"
              placeholder="Search stations, artists, genres"
              aria-label="Search stations, artists, and genres"
            />
            <Loader2
              v-if="searchStore.isLoading"
              stroke-width="1.5"
              :size="16"
              class="command-panel__loader"
              aria-hidden="true"
            />
            <button
              type="button"
              class="command-panel__close"
              aria-label="Close search"
              @click="closeDialog"
            >
              <X stroke-width="1.5" :size="16" />
            </button>
          </div>

          <div class="command-tabs" role="tablist" aria-label="Search categories">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              class="command-tabs__button"
              :class="{ 'command-tabs__button--active': searchStore.activeTab === tab.id }"
              role="tab"
              :aria-selected="searchStore.activeTab === tab.id"
              @click="setActiveTab(tab.id)"
            >
              <span>{{ tab.label }}</span>
              <span class="command-tabs__count">{{ searchStore.tabCounts[tab.id] }}</span>
            </button>
          </div>

          <div v-if="searchStore.error" class="command-error" role="status">
            {{ searchStore.error }}
          </div>

          <div class="command-results" aria-label="Search results">
            <div
              v-if="shouldShowSkeleton"
              class="command-skeletons"
              aria-label="Loading search results"
              aria-live="polite"
            >
              <div v-for="index in 4" :key="index" class="command-skeleton">
                <span class="command-skeleton__artwork" />
                <span class="command-skeleton__copy">
                  <span class="command-skeleton__line command-skeleton__line--wide" />
                  <span class="command-skeleton__line command-skeleton__line--narrow" />
                </span>
              </div>
            </div>

            <button
              v-for="(item, index) in currentItems"
              :key="`${item.kind}-${item.id}`"
              type="button"
              class="command-result"
              :class="{ 'command-result--selected': selectedIndex === index }"
              :aria-current="selectedIndex === index ? 'true' : undefined"
              @mouseenter="selectedIndex = index"
              @click="selectItem(item)"
            >
              <span v-if="item.kind === 'stations'" class="command-result__artwork">
                <FallbackArtwork
                  :src="item.station.favicon"
                  :alt="item.station.name"
                  :text="item.station.name"
                />
              </span>
              <span
                v-else-if="item.kind === 'artists'"
                class="command-result__artwork command-result__artwork--round"
              >
                <FallbackArtwork
                  :src="item.artist.image"
                  :alt="item.artist.name"
                  :text="item.artist.name"
                />
              </span>
              <span
                v-else
                class="command-result__genre"
                :style="{ backgroundColor: item.genre.accentColor }"
              >
                <Tags stroke-width="1.5" :size="16" />
              </span>

              <span class="command-result__copy">
                <span class="command-result__label">{{ item.label }}</span>
                <span class="command-result__meta">{{ item.meta }}</span>
              </span>

              <Radio v-if="item.kind === 'stations'" stroke-width="1.5" :size="15" />
              <Disc3 v-else-if="item.kind === 'artists'" stroke-width="1.5" :size="15" />
              <Music2 v-else stroke-width="1.5" :size="15" />
            </button>

            <div v-if="shouldShowEmpty" class="command-empty" role="status">
              <p>{{ emptyMessage }}</p>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '../styles/search-dialog';
</style>
