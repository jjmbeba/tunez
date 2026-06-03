<script setup lang="ts">
import { useRouter } from "vue-router";
import { useHomeFeed } from "@/features/home/composables/use-home-feed";
import StationRail from "@/features/home/components/station-rail.vue";
import PageHeader from "@/shared/components/page-header.vue";

const router = useRouter();
const {
  trendingStations,
  isTrendingLoading,
  isTrendingError,
  trendingError,
  recentStations,
  showRecentStations,
  favoriteStations,
  showFavoriteStations,
} = useHomeFeed();

function goToStation(id: string) {
  router.push(`/radio/${encodeURIComponent(id)}`);
}
</script>

<template>
  <section class="page">
    <PageHeader title="Home" subtitle="Your curated listening feed" />

    <div class="home-feed">
      <StationRail
        title="Trending Stations"
        :stations="trendingStations"
        :is-loading="isTrendingLoading"
        :is-error="isTrendingError"
        :error="trendingError"
        :skeleton-count="6"
        @select="goToStation"
      />

      <StationRail
        v-if="showRecentStations"
        title="Recently Played"
        :stations="recentStations"
        @select="goToStation"
      />

      <StationRail
        v-if="showFavoriteStations"
        title="Favorites"
        :stations="favoriteStations"
        @select="goToStation"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/page";

.home-feed {
  display: grid;
  gap: 28px;
}
</style>
