import { get } from "@/lib/api";
import type { Album, Artist } from "@tunes/types";
import { ref, watchEffect } from "vue";

export function useArtist(name: string) {
  const artist = ref<Artist | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  watchEffect(async () => {
    if (!name) return;

    loading.value = true;
    error.value = null;

    try {
      artist.value = await get<Artist>(`/artists/${encodeURIComponent(name)}`);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load artist";
    } finally {
      loading.value = false;
    }
  });

  return { artist, loading, error };
}

export function useArtistAlbums(name: string) {
  const albums = ref<Album[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);

  watchEffect(async () => {
    if (!name) return;

    loading.value = true;
    error.value = null;

    try {
      albums.value = await get<Album[]>(`/artists/${encodeURIComponent(name)}/albums`);
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load albums";
    } finally {
      loading.value = false;
    }
  });

  return { albums, loading, error };
}

export function useArtistSimilar(name: string) {
  const similar = ref<
    Array<{
      name: string;
      image: string;
      url: string;
    }>
  >([]);
  const loading = ref(true);
  const error = ref<string | null>();

  watchEffect(async () => {
    try {
      similar.value = await get<Array<{ name: string; image: string; url: string }>>(
        `/artists/${encodeURIComponent(name)}/similar`,
      );
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load similar artists";
    } finally {
      loading.value = false;
    }
  });

  return { similar, loading, error };
}
