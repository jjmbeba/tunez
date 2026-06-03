<script setup lang="ts">
import type { GenreDefinition } from '@/features/genres'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

defineProps<{ genre: GenreDefinition }>()
</script>

<template>
  <header class="genre-hero">
    <div class="genre-hero-media">
      <FallbackArtwork :src="''" :alt="genre.name" :text="genre.name" />
    </div>
    <div class="genre-hero-info">
      <h1 class="genre-hero-name">{{ genre.name }}</h1>
      <div v-if="genre.heroLabels.length" class="genre-hero-tags">
        <span v-for="label in genre.heroLabels" :key="label" class="genre-hero-tag">
          {{ label }}
        </span>
      </div>
    </div>
  </header>
  <p class="genre-hero-copy">{{ genre.heroCopy }}</p>
</template>

<style scoped lang="scss">
.genre-hero {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 16px;
  animation: reveal-up 0.5s ease-out both;
}

.genre-hero-media {
  flex-shrink: 0;
  width: 144px;
  height: 144px;
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.genre-hero-info {
  min-width: 0;
  padding-top: 4px;
}

.genre-hero-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--color-text);
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.genre-hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genre-hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
  color: var(--minimal-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.genre-hero-copy {
  margin: 0 0 32px;
  color: var(--minimal-muted);
  font-size: 13px;
  line-height: 1.6;
  max-width: 640px;
}

@media (max-width: 600px) {
  .genre-hero {
    flex-direction: column;
    gap: 16px;
  }

  .genre-hero-media {
    width: 120px;
    height: 120px;
  }

  .genre-hero-name {
    font-size: 20px;
  }
}
</style>
