<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGenreDetail } from '@/composables/use-genre-detail'
import BackLink from '@/shared/components/back-link.vue'
import DetailSheetShell from '@/features/shell/detail-sheet-shell.vue'
import GenreHero from '@/features/genres/components/GenreHero.vue'
import GenreStationsSection from '@/features/genres/components/GenreStationsSection.vue'
import GenreArtistsSection from '@/features/genres/components/GenreArtistsSection.vue'
import GenreRelatedSection from '@/features/genres/components/GenreRelatedSection.vue'

const route = useRoute()
const router = useRouter()
const genreId = computed(() => String(route.params.id ?? ''))
const { genre, topStations, relatedGenres, featuredArtists, isLoading, isError, error } =
  useGenreDetail(genreId)

function goToStation(id: string) {
  router.push(`/radio/${encodeURIComponent(id)}`)
}

function goToArtist(name: string) {
  router.push(`/artists/${encodeURIComponent(name)}`)
}
</script>

<template>
  <DetailSheetShell fallback-route="/genres">
    <section v-if="genre" class="page">
      <div class="page-back-link">
        <BackLink to="/genres" label="Genres" />
      </div>
      <GenreHero :genre="genre" />
      <GenreStationsSection
        :stations="topStations"
        :is-loading="isLoading"
        :is-error="isError"
        :error="error"
        @select="goToStation"
      />
      <GenreArtistsSection :artists="featuredArtists" @select="goToArtist" />
      <GenreRelatedSection :genres="relatedGenres" />
    </section>
  </DetailSheetShell>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';

.page-back-link {
  margin-bottom: 32px;
}
</style>
