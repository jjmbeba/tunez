<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

defineProps<{ artists: string[] }>()

const emit = defineEmits<{ select: [name: string] }>()
</script>

<template>
  <section v-if="artists.length" class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Users stroke-width="1" :size="16" />
        <span>Featured Artists</span>
      </h2>
    </div>

    <div class="artists-carousel">
      <button
        v-for="artist in artists"
        :key="artist"
        type="button"
        class="artist-card"
        @click="emit('select', artist)"
      >
        <div class="artist-avatar">
          <FallbackArtwork :src="''" :alt="artist" :text="artist" />
        </div>
        <span class="artist-name">{{ artist }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/section-shared';
@use '@/features/artists/styles/carousel';

.artists-carousel {
  @include carousel.carousel;
  gap: 16px;
  min-height: 120px;
}

.artist-card {
  flex: 0 0 auto;
  width: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text);
  font-family: inherit;
  scroll-snap-align: start;
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }
}

.artist-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.artist-name {
  width: 100%;
  min-height: 2.6em;
  max-height: 2.6em;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
