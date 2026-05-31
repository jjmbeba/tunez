import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Station } from '@tunes/types'

export const useAudioStore = defineStore('audio', () => {
  const currentStation = ref<Station | null>(null)

  const isPlaying = ref(false)
  const volume = ref(0.8)
  const error = ref<string | null>(null)
  const retryCount = ref(0)

  function play(station: Station) {
    currentStation.value = station
    isPlaying.value = true
    error.value = null
    retryCount.value = 0
  }

  function pause() {
    isPlaying.value = false
  }

  function resume() {
    isPlaying.value = true
  }

  function stop() {
    currentStation.value = null
    isPlaying.value = false
    error.value = null
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
  }

  function setError(msg: string) {
    error.value = msg
  }

  function clearError() {
    error.value = null
    retryCount.value = 0
  }

  function resetRetry() {
    retryCount.value = 0
  }

  return {
    currentStation,
    isPlaying,
    volume,
    error,
    retryCount,
    play,
    pause,
    resume,
    stop,
    setVolume,
    setError,
    clearError,
    resetRetry,
  }
})
