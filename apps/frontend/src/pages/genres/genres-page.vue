<script setup lang="ts">
import { useGenres } from '@/composables/use-genres'
import PageHeader from '@/shared/components/page-header.vue'
import GenreTile from '@/features/genres/components/GenreTile.vue'

const genres = useGenres()
</script>

<template>
  <section class="page">
    <PageHeader title="Genres" subtitle="Explore music by genre" />

    <div class="genre-grid">
      <GenreTile v-for="genre in genres" :key="genre.id" :genre="genre" />
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';

.genre-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  padding-block-start: var(--space-6);
}
</style>
