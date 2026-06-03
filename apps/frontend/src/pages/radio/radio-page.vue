<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStations } from '@/composables/use-stations'
import { useStationSearch } from '@/composables/use-station-search'
import StationGrid from '@/features/radio/components/station-grid.vue'
import SearchBar from '@/features/radio/components/search-bar.vue'
import PageHeader from '@/shared/components/page-header.vue'

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
  <section class="page">
    <PageHeader title="Radio" subtitle="Live stations from Kenya">
      <SearchBar v-model="query" :is-loading="isSearchLoading" />
    </PageHeader>

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
@use '@/shared/styles/page';
</style>
