<script setup lang="ts">
import { ref, computed } from 'vue'
import { Play, Pause, VolumeX, Volume1, Volume2, X } from 'lucide-vue-next'
import { useAudioStore } from '@/stores/audio'
import { useAudio } from '@/composables/use-audio'
import FallbackArtwork from '@/shared/components/fallback-artwork.vue'

const audioEl = ref<HTMLAudioElement | null>(null)
const store = useAudioStore()

useAudio(audioEl)

const prevVolume = ref(store.volume)

const VolumeIcon = computed(() => {
  if (store.volume === 0) return VolumeX

  if (store.volume < 0.5) return Volume1
  return Volume2
})

function togglePlay() {
  if (!store.currentStation) return

  if (store.isPlaying) {
    store.pause()
  } else {
    store.resume()
  }
}

function toggleMute() {
  if (store.volume > 0) {
    prevVolume.value = store.volume
    store.setVolume(0)
  } else {
    store.setVolume(prevVolume.value || 0.8)
  }
}
</script>

<template>
  <div class="player-wrap">
    <div
      v-if="store.error"
      class="player-error"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span>{{ store.error }}</span>
      <button type="button" class="player-btn player-error-close" @click="store.clearError()">
        <X stroke-width="1.5" :size="14" />
      </button>
    </div>

    <footer class="player-bar">
      <audio ref="audioEl" preload="none" />

    <div class="player-info">
      <template v-if="store.currentStation">
        <div class="player-artwork">
          <FallbackArtwork
            :src="store.currentStation.favicon"
            :alt="store.currentStation.name"
            icon="Radio"
            :size="18"
          />
        </div>
        <p class="player-name">{{ store.currentStation.name }}</p>
      </template>

      <p v-else class="player-idle-text">No station selected</p>
    </div>

    <div class="player-volume">
      <button
        type="button"
        class="player-btn player-vol-btn"
        :disabled="!store.currentStation"
        :aria-label="store.volume === 0 ? 'Unmute' : 'Mute'"
        @click="toggleMute"
      >
        <component :is="VolumeIcon" stroke-width="1.5" :size="16" />
      </button>
      <input
        type="range"
        class="player-slider"
        aria-label="Volume"
        min="0"
        max="1"
        step="0.01"
        :value="store.volume"
        :disabled="!store.currentStation"
        @input="store.setVolume(Number(($event.target as HTMLInputElement).value))"
      />
    </div>

    <div class="player-controls">
      <button
        type="button"
        class="player-btn player-btn--play"
        :disabled="!store.currentStation"
        :aria-label="store.isPlaying ? 'Pause' : 'Play'"
        @click="togglePlay"
      >
        <Play v-if="!store.isPlaying" stroke-width="1.5" :size="20" />
        <Pause v-else stroke-width="1.5" :size="20" />
      </button>
    </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
@use './player';
</style>
