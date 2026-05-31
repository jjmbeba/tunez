<script setup lang="ts">
import type { Station } from '@tunes/types'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import { ThumbsUp, Play, Pause } from 'lucide-vue-next'
import { useAudioStore } from '@/stores/audio'
import { computed } from 'vue'

const props = defineProps<{
  station: Station
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const audioStore = useAudioStore()
const isCurrent = computed(() => props.station.id === audioStore.currentStation?.id)
const isNowPlaying = computed(() => isCurrent.value && audioStore.isPlaying)
const playButtonLabel = computed(() => {
  const stationName = props.station.name || 'station'
  return isNowPlaying.value ? `Pause ${stationName}` : `Play ${stationName}`
})

function handlePlay() {
  if (isCurrent.value) {
    if (audioStore.isPlaying) {
      audioStore.pause()
    } else {
      audioStore.resume()
    }
  } else {
    audioStore.play(props.station)
  }
}
</script>

<template>
  <div
    class="station-card"
    :class="{ 'station-card--active': isCurrent }"
  >
    <div class="card-cover">
      <FallbackArtwork :src="station.favicon" :alt="station.name" icon="Radio" :size="24" />
      <button
        type="button"
        class="card-play"
        :class="{ 'card-play--active': isCurrent }"
        :aria-label="playButtonLabel"
        :aria-pressed="isNowPlaying"
        @click="handlePlay"
      >
        <Pause v-if="isNowPlaying" stroke-width="1.5" :size="20" />
        <Play v-else stroke-width="1.5" :size="20" />
      </button>
    </div>
    <button type="button" class="card-body" @click="emit('select', station.id)">
      <p class="card-name">{{ station.name }}</p>
      <div v-if="station.tags?.length" class="card-tags">
        <span v-for="tag in station.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="card-footer">
        <div class="card-votes">
          <ThumbsUp stroke-width="1" :size="10" />
          <span>{{ station.votes }}</span>
        </div>
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/card';
</style>
