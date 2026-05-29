import { get } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import type { Album, Artist, ArtistBrief, ArtistSearchResult } from "@tunes/types";
import { computed, ref, watch } from "vue";

export function useArtist(name: string) {
  return useQuery({
    queryKey: ["artists", name],
    queryFn: async () => {
      return await get<Artist>(`/artists/${encodeURIComponent(name)}`);
    },
  });
}

export function useArtistAlbums(name: string) {
  return useQuery({
    queryKey: ["albums", name],
    queryFn: async () => {
      return await get<Album[]>(`/artists/${encodeURIComponent(name)}/albums`);
    },
  });
}

export function useArtistSimilar(name: string) {
  return useQuery({
    queryKey: ["artists-similar", name],
    queryFn: async () => {
      return await get<ArtistBrief[]>(
        `/artists/${encodeURIComponent(name)}/similar`,
      );
    },
  });
}

export function useArtistSearch() {
  const query = ref("");
  const debouncedQuery = ref("");

  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  watch(query, (val) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debouncedQuery.value = val;
    }, 300);
  });

  const queryResult = useQuery({
    queryKey: ["artist-search", debouncedQuery],
    queryFn: async () => {
      return await get<ArtistSearchResult[]>(
        `/artists/search?q=${encodeURIComponent(debouncedQuery.value)}&limit=10`,
      );
    },
    enabled: computed(() => debouncedQuery.value.length >= 2),
  });

  const showResults = computed(() => debouncedQuery.value.length >= 2);

  return { query, showResults, ...queryResult };
}
