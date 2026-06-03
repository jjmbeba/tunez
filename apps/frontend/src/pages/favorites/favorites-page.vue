<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, Radio } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import PageHeader from '@/shared/components/page-header.vue'
import StationCard from '@/features/radio/components/station-card.vue'
import type { StationCardStation } from '@/features/radio/station-card.types'

const store = useFavoritesStore()
const router = useRouter()

const stations = computed<StationCardStation[]>(() =>
  store.favorites.map((f) => ({
    id: f.stationId,
    name: f.stationName,
    streamUrl: f.stationStreamUrl,
    favicon: f.stationFavicon || '',
    tags: [],
  })),
)

function goToStation(id: string) {
  router.push(`/radio/${encodeURIComponent(id)}`)
}

onMounted(() => {
  void store.ensureLoaded().catch(() => undefined)
})
</script>

<template>
  <section class="page">
    <PageHeader title="Favorites" />

    <div v-if="store.isLoading" class="state">
      <Radio stroke-width="1" :size="32" />
      <p class="state-title">Loading favorites...</p>
    </div>

    <div v-else-if="store.error" class="state state-error">
      <p>{{ store.error }}</p>
    </div>

    <div v-else-if="stations.length === 0" class="state">
      <Heart stroke-width="1" :size="32" />
      <p class="state-title">No favorites yet</p>
      <p class="state-desc">Tap the heart icon on any station to save it here.</p>
    </div>

    <div v-else class="grid">
      <StationCard
        v-for="station in stations"
        :key="station.id"
        :station="station"
        @select="goToStation"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';
@use '@/shared/styles/state';

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 16px;
}
</style>
