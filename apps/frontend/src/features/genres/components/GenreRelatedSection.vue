<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import type { GenreDefinition } from '@/features/genres'

defineProps<{ genres: GenreDefinition[] }>()
</script>

<template>
  <section v-if="genres.length" class="section">
    <div class="section-header">
      <h2 class="section-title">
        <ArrowRight stroke-width="1" :size="16" />
        <span>Also Try</span>
      </h2>
    </div>

    <ul class="related-list">
      <li v-for="related in genres" :key="related.id" class="related-item">
        <RouterLink :to="`/genres/${related.id}`" class="related-link">
          <span class="related-name">{{ related.name }}</span>
          <span class="related-desc">{{ related.description }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use '../styles/section-shared';

.related-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.related-item {
  border: 1px solid var(--minimal-border);
  border-radius: var(--radius-md);
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }
}

.related-link {
  display: grid;
  gap: 4px;
  padding: 12px;
  color: var(--color-text);
  text-decoration: none;
}

.related-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.related-desc {
  font-size: 12px;
  color: var(--minimal-subtle);
  line-height: 1.4;
}
</style>
