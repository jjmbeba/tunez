import { get } from "@/lib/api";
import { useQuery } from "@tanstack/vue-query";
import type { Album, Artist } from "@tunes/types";

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
