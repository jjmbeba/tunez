import { get } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import type { Album, Artist, ArtistBrief, ArtistSearchResult } from "@tunes/types";
import { computed, ref, toValue, watch } from "vue";
import type { MaybeRefOrGetter } from "vue";

function useArtistName(name: MaybeRefOrGetter<string>) {
  return computed(() => toValue(name));
}

export function useArtist(name: MaybeRefOrGetter<string>) {
  const artistName = useArtistName(name);

  return useQuery({
    queryKey: computed(() => ["artists", artistName.value]),
    queryFn: async () => {
      return await get<Artist>(`/artists/${encodeURIComponent(artistName.value)}`);
    },
    enabled: computed(() => artistName.value.length > 0),
  });
}

export function useArtistAlbums(name: MaybeRefOrGetter<string>) {
  const artistName = useArtistName(name);

  return useQuery({
    queryKey: computed(() => ["albums", artistName.value]),
    queryFn: async () => {
      return await get<Album[]>(`/artists/${encodeURIComponent(artistName.value)}/albums`);
    },
    enabled: computed(() => artistName.value.length > 0),
  });
}

export function useArtistSimilar(name: MaybeRefOrGetter<string>) {
  const artistName = useArtistName(name);

  return useQuery({
    queryKey: computed(() => ["artists-similar", artistName.value]),
    queryFn: async () => {
      return await get<ArtistBrief[]>(
        `/artists/${encodeURIComponent(artistName.value)}/similar`,
      );
    },
    enabled: computed(() => artistName.value.length > 0),
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

  return { query, debouncedQuery, showResults, ...queryResult };
}
