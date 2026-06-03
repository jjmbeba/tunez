<script setup lang="ts">
import type { GenreDefinition } from '@/features/genres'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

defineProps<{ genre: GenreDefinition }>()
</script>

<template>
  <RouterLink :to="`/genres/${genre.id}`" class="genre-tile">
    <div class="genre-tile-cover">
      <FallbackArtwork :src="''" :alt="genre.name" :text="genre.name" />
    </div>
    <p class="genre-tile-name">{{ genre.name }}</p>
    <p class="genre-tile-desc">{{ genre.description }}</p>
  </RouterLink>
</template>

<style scoped lang="scss">
.genre-tile {
  display: flex;
  flex-direction: column;
  color: var(--color-text);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }
}

.genre-tile-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.genre-tile-name {
  margin: 0;
  padding: 8px 2px 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.genre-tile-desc {
  margin: 0;
  padding: 0 2px 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--minimal-subtle);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
