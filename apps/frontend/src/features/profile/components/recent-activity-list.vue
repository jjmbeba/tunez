<script setup lang="ts">
import type { ListeningHistory } from '@tunes/types'
import { Clock3 } from 'lucide-vue-next'
import { formatRelativeTime } from '@/lib/format-relative-time'
import { formatDuration } from '@/features/profile/lib/profile-formatters'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

defineProps<{
  entries: ListeningHistory[]
  isLoading: boolean
  error: string | null
}>()
</script>

<template>
  <section class="section" aria-labelledby="recent-title">
    <div class="section-header">
      <h2 id="recent-title" class="section-title">
        <Clock3 stroke-width="1" :size="16" />
        <span>Recent activity</span>
      </h2>
    </div>

    <div v-if="isLoading" class="history-skeleton" aria-hidden="true">
      <div v-for="n in 4" :key="n" class="history-item history-item--skeleton">
        <div class="skeleton-cover" />
        <div class="history-copy history-copy--skeleton">
          <div class="skeleton-line skeleton-line--name" />
          <div class="skeleton-line skeleton-line--meta" />
        </div>
      </div>
    </div>

    <div v-else-if="error" class="state state-error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="entries.length === 0" class="state">
      <Clock3 stroke-width="1" :size="32" />
      <p class="state-title">No listening history yet</p>
      <p class="state-desc">Play a station for a few seconds and it will appear here.</p>
    </div>

    <ul v-else class="history-list">
      <li v-for="entry in entries" :key="entry.id" class="history-item">
        <div class="station-artwork">
          <FallbackArtwork
            :src="entry.stationFavicon || ''"
            :alt="entry.stationName"
            :text="entry.stationName"
          />
        </div>

        <div class="history-copy">
          <p class="history-name">{{ entry.stationName }}</p>
          <p class="history-meta">
            <span>{{ formatDuration(entry.duration) }}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{{ formatRelativeTime(entry.listenedAt) }}</span>
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/section';
@use '@/shared/styles/state';

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.history-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  background: transparent;
  transition: background 0.15s ease;
}

.history-item:hover {
  background: var(--color-surface);
}

.station-artwork {
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: var(--color-surface);
}

.history-copy {
  min-width: 0;
}

.history-name {
  margin: 0;
  color: var(--minimal-ink);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.history-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0 0;
  color: var(--minimal-subtle);
  font-size: 13px;
}

.history-skeleton {
  display: grid;
  gap: 4px;
}

.history-copy--skeleton {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-cover {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line--name {
  width: 80%;
}

.skeleton-line--meta {
  width: 50%;
  height: 10px;
}

.history-item--skeleton {
  pointer-events: none;
}
</style>
