<script setup lang="ts">
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'
import FavoriteToggle from '@/features/favorites/components/favorite-toggle.vue'
import { ThumbsUp, Play } from 'lucide-vue-next'
import { useAudioStore } from '@/stores/audio'
import { computed } from 'vue'
import type { StationCardStation } from '../station-card.types'

const props = defineProps<{
  station: StationCardStation
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
      <FallbackArtwork
        :src="station.favicon"
        :alt="station.name"
        :text="station.name"
      />
      <FavoriteToggle :station="station" variant="cover" class="card-fav" />
      <button
        type="button"
        class="card-play"
        :class="{ 'card-play--active': isCurrent }"
        :aria-label="playButtonLabel"
        :aria-pressed="isNowPlaying"
        @click="handlePlay"
      >
        <span v-if="isNowPlaying" class="equalizer" aria-hidden="true">
          <span class="equalizer__bar" />
          <span class="equalizer__bar equalizer__bar--mid" />
          <span class="equalizer__bar" />
        </span>
        <Play v-else-if="isCurrent" stroke-width="1.5" :size="20" />
        <Play v-else stroke-width="1.5" :size="20" />
      </button>
    </div>
    <div class="card-body">
      <button type="button" class="card-body-main" @click="emit('select', station.id)">
        <p class="card-name">{{ station.name }}</p>
        <div v-if="station.tags?.length" class="card-tags">
          <span v-for="tag in station.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </button>
      <div v-if="(station.votes ?? 0) > 0" class="card-footer">
        <div class="card-votes">
          <ThumbsUp stroke-width="1" :size="10" />
          <span>{{ station.votes }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/card';
</style>
