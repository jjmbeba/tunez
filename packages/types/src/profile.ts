export interface ProfileTopStation {
  stationId: string;
  stationName: string;
  stationFavicon: string | null;
  listenCount: number;
  totalListeningSeconds: number;
}

export interface ProfileStats {
  favoriteCount: number;
  totalListens: number;
  totalListeningSeconds: number;
  topStations: ProfileTopStation[];
}
