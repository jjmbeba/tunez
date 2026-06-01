<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Clock3, Radio } from 'lucide-vue-next'
import { formatRelativeTime } from '@/lib/format-relative-time'
import { useHistoryStore } from '@/stores/history'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import PageHeader from '@/shared/components/page-header.vue'

const historyStore = useHistoryStore()

const recentEntries = computed(() => historyStore.recentEntries)

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

onMounted(() => {
  void historyStore.fetchRecent(10).catch(() => undefined)
})
</script>

<template>
  <section class="page">
    <PageHeader title="Profile" subtitle="Recent listening activity" />

    <div v-if="historyStore.isLoading" class="state">
      <Radio stroke-width="1" :size="32" />
      <p class="state-title">Loading listening history...</p>
    </div>

    <div v-else-if="historyStore.error" class="state state-error">
      <p>{{ historyStore.error }}</p>
    </div>

    <div v-else-if="recentEntries.length === 0" class="state">
      <Clock3 stroke-width="1" :size="32" />
      <p class="state-title">No listening history yet</p>
      <p class="state-desc">Play a station for a few seconds and it will appear here.</p>
    </div>

    <ul v-else class="history-list">
      <li v-for="entry in recentEntries" :key="entry.id" class="history-item">
        <div class="history-artwork">
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
            <span aria-hidden="true">|</span>
            <span>{{ formatRelativeTime(entry.listenedAt) }}</span>
          </p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/page";
@use "@/shared/styles/state";

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.history-item {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.02);
}

.history-artwork {
  width: 56px;
  height: 56px;
  overflow: hidden;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
}

.history-copy {
  min-width: 0;
}

.history-name {
  margin: 0;
  color: var(--minimal-ink);
  font-size: 15px;
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
