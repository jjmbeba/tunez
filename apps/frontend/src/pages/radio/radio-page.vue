<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStations } from '@/composables/use-stations'
import { useStationSearch } from '@/composables/use-station-search'
import StationGrid from '@/features/radio/components/station-grid.vue'
import SearchBar from '@/features/radio/components/search-bar.vue'

const router = useRouter()

function goToStation(id: string) {
  router.push(`/radio/${encodeURIComponent(id)}`)
}

const {
  data: listStations,
  isLoading: isListLoading,
  isError: isListError,
  error: listError,
} = useStations()

const {
  query,
  debouncedQuery,
  showResults,
  data: searchResults,
  isLoading: isSearchLoading,
  isError: isSearchError,
  error: searchError,
} = useStationSearch()

const stations = computed(() => (showResults.value ? searchResults.value : listStations.value))

const isLoading = computed(() => (showResults.value ? isSearchLoading.value : isListLoading.value))

const isError = computed(() => (showResults.value ? isSearchError.value : isListError.value))

const displayError = computed(() => (showResults.value ? searchError.value : listError.value))

const emptyMessage = computed(() =>
  showResults.value
    ? `No stations match "${debouncedQuery.value}"`
    : 'Check back later for Kenyan radio stations.',
)
</script>

<template>
  <section class="radio-page">
    <div class="page-header">
      <h1 class="page-title">Radio</h1>
      <p class="page-subtitle">Live stations from Kenya</p>
      <SearchBar v-model="query" :is-loading="isSearchLoading" />
    </div>

    <StationGrid
      :stations="stations"
      :is-loading="isLoading"
      :is-error="isError"
      :error="displayError"
      :empty-message="emptyMessage"
      @select="goToStation"
    />
  </section>
</template>

<style scoped lang="scss">
.radio-page {
  padding: var(--space-8) var(--space-6);
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--space-6);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--minimal-ink);
  margin: 0 0 2px;
  letter-spacing: -0.015em;
}

.page-subtitle {
  color: var(--minimal-subtle);
  font-size: 13px;
  margin: 0 0 var(--space-4);
}
</style>
