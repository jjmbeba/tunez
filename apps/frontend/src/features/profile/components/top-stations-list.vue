<script setup lang="ts">
import type { ProfileStats } from '@tunes/types'
import { Radio, Trophy } from 'lucide-vue-next'
import {
  formatCompactDuration,
  formatListenCount,
  getErrorMessage,
} from '@/features/profile/lib/profile-formatters'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

defineProps<{
  stats: ProfileStats | undefined
  isLoading: boolean
  error: unknown
}>()
</script>

<template>
  <section class="section" aria-labelledby="top-stations-title">
    <div class="section-header">
      <h2 id="top-stations-title" class="section-title">
        <Radio stroke-width="1" :size="16" />
        <span>Top stations</span>
      </h2>
    </div>

    <div v-if="isLoading" class="state">Loading...</div>

    <div v-else-if="error" class="state state-error">
      <p>{{ getErrorMessage(error, 'Failed to load top stations') }}</p>
    </div>

    <div v-else-if="!stats || stats.topStations.length === 0" class="state">
      <Trophy stroke-width="1" :size="28" />
      <p class="state-title">No top stations yet</p>
      <p class="state-desc">Your most-played stations will appear here after you listen.</p>
    </div>

    <ol v-else class="top-stations-list">
      <li
        v-for="(station, index) in stats.topStations"
        :key="`${station.stationId}-${station.stationName}`"
        class="top-station-item"
      >
        <span class="rank">{{ index + 1 }}</span>
        <div class="station-artwork">
          <FallbackArtwork
            :src="station.stationFavicon || ''"
            :alt="station.stationName"
            :text="station.stationName"
          />
        </div>
        <div class="history-copy">
          <p class="history-name">{{ station.stationName }}</p>
          <p class="history-meta">
            <span>{{ formatListenCount(station.listenCount) }}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{{ formatCompactDuration(station.totalListeningSeconds) }}</span>
          </p>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/section';
@use '@/shared/styles/state';

.top-stations-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.top-station-item {
  display: grid;
  grid-template-columns: 24px 48px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  background: transparent;
  transition: background 0.15s ease;
}

.top-station-item:hover {
  background: var(--color-surface);
}

.rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  border: 1px solid var(--minimal-border);
  background: transparent;
  color: var(--minimal-muted);
  font-size: 11px;
  font-weight: 600;
}

.station-artwork {
  width: 48px;
  height: 48px;
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
</style>
