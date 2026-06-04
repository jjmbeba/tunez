<script setup lang="ts">
import { useArtistAlbums } from '@/composables/use-artist'
import { useRoute } from 'vue-router'
import BackLink from '@/shared/components/back-link.vue'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import PageHeader from '@/shared/components/page-header.vue'

const route = useRoute()
const name = route.params.name as string

const { data: albums, isLoading, error } = useArtistAlbums(name)
</script>

<template>
  <section class="page">
    <div class="page-back-link">
      <BackLink :to="`/artists/${encodeURIComponent(name)}`" label="Back to artist" />
    </div>

    <PageHeader title="Discography" />

    <div v-if="isLoading" class="album-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="skeleton-cover" />
        <div class="skeleton-label" />
      </div>
    </div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <template v-else-if="albums?.length">
      <div class="album-grid">
        <div v-for="album in albums" :key="album.id" class="album-card" tabindex="0">
          <div class="album-cover">
            <FallbackArtwork :src="album.image" :alt="album.title" :text="album.title" />
          </div>
          <p class="album-title">{{ album.title }}</p>
        </div>
      </div>
    </template>

    <div v-else class="state">No albums found.</div>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';
@use '@/shared/styles/state';
@use '../../features/artists/styles/album-card';

.state.error {
  color: var(--color-danger);
}

.page-back-link {
  margin-bottom: 8px;
}

.skeleton-card {
  padding: 6px;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  margin-bottom: 10px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-label {
  width: 80%;
  height: 12px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
