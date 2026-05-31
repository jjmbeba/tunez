import { watch, onMounted, onUnmounted } from "vue";
import type { Ref } from "vue";
import { useAudioStore } from "@/stores/audio";

const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;

function safePlay(audio: HTMLAudioElement) {
  audio.play().catch(() => {});
}

function getAudioSource(audio: HTMLAudioElement) {
  return audio.currentSrc || audio.src;
}

export function useAudio(audioEl: Ref<HTMLAudioElement | null>) {
  const store = useAudioStore();
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  function clearRetryTimer() {
    if (retryTimer !== null) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  }

  function attemptRetry() {
    if (!store.currentStation) return;

    store.retryCount++;
    if (store.retryCount > MAX_RETRIES) {
      store.pause();
      store.setError("Station offline — try refreshing or pick another station");
      return;
    }

    retryTimer = setTimeout(() => {
      const el = audioEl.value;
      if (!el || !store.currentStation) return;

      el.src = store.currentStation.streamUrl;
      el.load();
      safePlay(el);
    }, RETRY_DELAY);
  }

  function onPlay() {
    clearRetryTimer();
    store.resetRetry();
    store.resume();
  }

  function onPause() {
    store.pause();
  }

  function onError() {
    attemptRetry();
  }

  function onEnded() {
    store.stop();
  }

  watch(
    () => store.currentStation,
    (station) => {
      const audio = audioEl.value;
      if (!audio) return;

      clearRetryTimer();
      store.resetRetry();

      if (!station) {
        audio.pause();
        audio.removeAttribute("src");
        return;
      }

      audio.src = station.streamUrl;
      audio.load();
      safePlay(audio);
    },
  );

  watch(
    () => store.isPlaying,
    (playing) => {
      const audio = audioEl.value;
      if (!audio || !store.currentStation) return;

      if (playing) {
        const currentSrc = getAudioSource(audio);
        if (currentSrc !== store.currentStation.streamUrl) {
          audio.src = store.currentStation.streamUrl;
          audio.load();
        }
        safePlay(audio);
      } else {
        audio.pause();
      }
    },
  );

  watch(
    () => store.volume,
    (v) => {
      const audio = audioEl.value;
      if (!audio) return;
      audio.volume = v;
    },
  );

  onMounted(() => {
    const audio = audioEl.value;
    if (!audio) return;

    audio.volume = store.volume;

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    audio.addEventListener("ended", onEnded);
  });

  onUnmounted(() => {
    clearRetryTimer();

    const audio = audioEl.value;
    if (!audio) return;

    audio.removeEventListener("play", onPlay);
    audio.removeEventListener("pause", onPause);
    audio.removeEventListener("error", onError);
    audio.removeEventListener("ended", onEnded);
  });
}
