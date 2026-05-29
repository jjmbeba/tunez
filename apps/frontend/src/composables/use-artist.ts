import { get } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import type { Album, Artist, ArtistSearchResult } from "@tunes/types";
import { computed, type Ref } from "vue";

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
      return await get<Array<{ name: string; image: string; url: string }>>(
        `/artists/${encodeURIComponent(name)}/similar`,
      );
    },
  });
}

export function useArtistSearch(query: Ref<string>) {
  return useQuery({
    queryKey: ["artist-search", query],
    queryFn: async () => {
      return await get<ArtistSearchResult[]>(
        `/artists/search?q=${encodeURIComponent(query.value)}&limit=10`,
      );
    },
    enabled: computed(() => query.value.length >= 2),
  });
}
