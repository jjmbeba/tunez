<script setup lang="ts">
import { Clock3, Heart, Radio, Trophy } from 'lucide-vue-next'
import { useProfileDashboard } from '@/features/profile/composables/use-profile-dashboard'
import { formatRelativeTime } from '@/lib/format-relative-time'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import PageHeader from '@/shared/components/page-header.vue'

const {
  stats,
  isStatsLoading,
  isStatsError,
  statsError,
  recentEntries,
  isRecentLoading,
  recentError,
} = useProfileDashboard()

function formatDuration(duration: number) {
  if (duration < 60) {
    return `${duration}s`
  }

  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60

  if (seconds === 0) {
    return `${minutes}m`
  }

  return `${minutes}m ${seconds}s`
}

function formatCompactDuration(duration: number) {
  if (duration < 60) {
    return `${duration}s`
  }

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`
  }

  if (hours > 0) {
    return `${hours}h`
  }

  return `${minutes}m`
}

function formatListenCount(count: number) {
  return count === 1 ? '1 listen' : `${count} listens`
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
</script>

<template>
  <section class="page">
    <PageHeader title="Profile" subtitle="Your listening dashboard" />

    <section class="section" aria-labelledby="stats-title">
      <div class="section-header">
        <h2 id="stats-title" class="section-title">
          <Trophy stroke-width="1" :size="16" />
          <span>All-time stats</span>
        </h2>
      </div>

      <div v-if="isStatsLoading" class="stats-grid" aria-hidden="true">
        <div v-for="n in 3" :key="n" class="stat-card stat-card--skeleton">
          <div class="skeleton-icon" />
          <div class="skeleton-line skeleton-line--label" />
          <div class="skeleton-line skeleton-line--value" />
        </div>
      </div>

      <div v-else-if="isStatsError" class="state state-error">
        <p>{{ getErrorMessage(statsError, 'Failed to load profile stats') }}</p>
      </div>

      <template v-else-if="stats">
        <div class="stats-grid">
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
      </template>
    </section>

    <section class="section" aria-labelledby="top-stations-title">
      <div class="section-header">
        <h2 id="top-stations-title" class="section-title">
          <Radio stroke-width="1" :size="16" />
          <span>Top stations</span>
        </h2>
      </div>

      <div v-if="isStatsLoading" class="state">Loading...</div>

      <div v-else-if="isStatsError" class="state state-error">
        <p>{{ getErrorMessage(statsError, 'Failed to load top stations') }}</p>
      </div>

      <div
        v-else-if="!stats || stats.topStations.length === 0"
        class="state"
      >
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

    <section class="section" aria-labelledby="recent-title">
      <div class="section-header">
        <h2 id="recent-title" class="section-title">
          <Clock3 stroke-width="1" :size="16" />
          <span>Recent activity</span>
        </h2>
      </div>

      <div v-if="isRecentLoading" class="history-skeleton" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="history-item history-item--skeleton">
          <div class="skeleton-cover" />
          <div class="history-copy history-copy--skeleton">
            <div class="skeleton-line skeleton-line--name" />
            <div class="skeleton-line skeleton-line--meta" />
          </div>
        </div>
      </div>

      <div v-else-if="recentError" class="state state-error">
        <p>{{ recentError }}</p>
      </div>

      <div v-else-if="recentEntries.length === 0" class="state">
        <Clock3 stroke-width="1" :size="32" />
        <p class="state-title">No listening history yet</p>
        <p class="state-desc">Play a station for a few seconds and it will appear here.</p>
      </div>

      <ul v-else class="history-list">
        <li v-for="entry in recentEntries" :key="entry.id" class="history-item">
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
  </section>
</template>

<style scoped lang="scss">
@use '@/shared/styles/page';
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

.skeleton-line--name {
  width: 80%;
}

.skeleton-line--meta {
  width: 50%;
  height: 10px;
}

.top-stations-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 4px;
}

.top-station-item,
.history-item {
  display: grid;
  align-items: center;
  padding: 8px 10px;
  border-radius: var(--radius-md);
  background: transparent;
  transition: background 0.15s ease;
}

.top-station-item {
  grid-template-columns: 24px 48px minmax(0, 1fr);
  gap: 12px;
}

.history-item {
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 14px;
}

.top-station-item:hover,
.history-item:hover {
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
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: var(--color-surface);
}

.top-station-item .station-artwork {
  width: 48px;
  height: 48px;
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

.top-station-item--skeleton,
.history-item--skeleton {
  pointer-events: none;
}
</style>
