<script setup lang="ts">
import type { ProfileStats } from '@tunes/types'
import { Clock3, Heart, Radio, Trophy } from 'lucide-vue-next'
import { formatCompactDuration, getErrorMessage } from '@/features/profile/lib/profile-formatters'

defineProps<{
  stats: ProfileStats | undefined
  isLoading: boolean
  error: unknown
}>()
</script>

<template>
  <section class="section" aria-labelledby="stats-title">
    <div class="section-header">
      <h2 id="stats-title" class="section-title">
        <Trophy stroke-width="1" :size="16" />
        <span>All-time stats</span>
      </h2>
    </div>

    <div v-if="isLoading" class="stats-grid" aria-hidden="true">
      <div v-for="n in 3" :key="n" class="stat-card stat-card--skeleton">
        <div class="skeleton-icon" />
        <div class="skeleton-line skeleton-line--label" />
        <div class="skeleton-line skeleton-line--value" />
      </div>
    </div>

    <div v-else-if="error" class="state state-error">
      <p>{{ getErrorMessage(error, 'Failed to load profile stats') }}</p>
    </div>

    <div v-else-if="stats" class="stats-grid">
      <article class="stat-card">
        <Radio stroke-width="1" :size="16" />
        <span class="stat-label">Total listens</span>
        <strong class="stat-value">{{ stats.totalListens.toLocaleString() }}</strong>
      </article>

      <article class="stat-card">
        <Clock3 stroke-width="1" :size="16" />
        <span class="stat-label">Listening time</span>
        <strong class="stat-value">
          {{ formatCompactDuration(stats.totalListeningSeconds) }}
        </strong>
      </article>

      <article class="stat-card">
        <Heart stroke-width="1" :size="16" />
        <span class="stat-label">Favorites</span>
        <strong class="stat-value">{{ stats.favoriteCount.toLocaleString() }}</strong>
      </article>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/section';
@use '@/shared/styles/state';

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: 12px;
}

.stat-card {
  display: grid;
  gap: 6px;
  padding: 12px;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--minimal-muted);
  transition: background 0.15s ease;
}

.stat-card--skeleton {
  pointer-events: none;
}

.stat-label {
  color: var(--minimal-subtle);
  font-size: 11px;
  font-weight: 500;
}

.stat-value {
  align-self: end;
  color: var(--minimal-ink);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.1;
}

.skeleton-icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line--label {
  width: 60%;
}

.skeleton-line--value {
  width: 40%;
  height: 20px;
}
</style>
