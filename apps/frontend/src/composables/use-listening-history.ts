import { onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'
import type { PlayableStation } from '@/shared/types/station'
import { useAudioStore } from '@/stores/audio'
import { useHistoryStore, type HistoryEntryInput } from '@/stores/history'

const MIN_LISTEN_SECONDS = 5

interface ActiveSession {
  stationId: string
  stationName: string
  stationFavicon: string | null
  stationStreamUrl: string
  listenedAt: Date | null
  playingStartedAt: number | null
  elapsedMs: number
}

function createSession(station: PlayableStation): ActiveSession {
  return {
    stationId: station.id,
    stationName: station.name,
    stationFavicon: station.favicon || null,
    stationStreamUrl: station.streamUrl,
    listenedAt: null,
    playingStartedAt: null,
    elapsedMs: 0,
  }
}

export function useListeningHistory(audioEl: Ref<HTMLAudioElement | null>) {
  const audioStore = useAudioStore()
  const historyStore = useHistoryStore()
  let activeSession: ActiveSession | null = null

  function ensureSession() {
    if (!audioStore.currentStation) return null

    if (!activeSession || activeSession.stationId !== audioStore.currentStation.id) {
      activeSession = createSession(audioStore.currentStation)
    }

    return activeSession
  }

  function startPlaybackSegment() {
    const session = ensureSession()
    if (!session || session.playingStartedAt !== null) return

    const now = Date.now()
    session.playingStartedAt = now
    session.listenedAt ??= new Date(now)
  }

  function pausePlaybackSegment() {
    if (!activeSession || activeSession.playingStartedAt === null) return

    activeSession.elapsedMs += Date.now() - activeSession.playingStartedAt
    activeSession.playingStartedAt = null
  }

  function finalizeSession(): HistoryEntryInput | null {
    if (!activeSession) return null
    pausePlaybackSegment()

    const session = activeSession
    activeSession = null

    if (!session.listenedAt) return null

    const duration = Math.floor(session.elapsedMs / 1000)
    if (duration < MIN_LISTEN_SECONDS) return null

    return {
      stationId: session.stationId,
      stationName: session.stationName,
      stationFavicon: session.stationFavicon,
      stationStreamUrl: session.stationStreamUrl,
      listenedAt: session.listenedAt.toISOString(),
      duration,
    } satisfies HistoryEntryInput
  }

  function persistFinalizedSession() {
    const entry = finalizeSession()
    if (!entry) return

    void historyStore.saveEntry(entry)
  }

  function persistFinalizedSessionBestEffort() {
    const entry = finalizeSession()
    if (!entry) return

    historyStore.saveEntryBestEffort(entry)
  }

  function onPlay() {
    startPlaybackSegment()
  }

  function onPause() {
    persistFinalizedSession()
  }

  function onPageHide() {
    persistFinalizedSessionBestEffort()
  }

  watch(
    () => audioStore.currentStation,
    (station, previousStation) => {
      if (previousStation && (!station || station.id !== previousStation.id)) {
        persistFinalizedSession()
      }

      if (!station) {
        activeSession = null
      }
    },
  )

  onMounted(() => {
    const audio = audioEl.value
    if (!audio) return

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('beforeunload', onPageHide)
  })

  onUnmounted(() => {
    persistFinalizedSession()

    const audio = audioEl.value
    if (audio) {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }

    window.removeEventListener('pagehide', onPageHide)
    window.removeEventListener('beforeunload', onPageHide)
  })
}
