export interface ListeningHistory {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  stationFavicon: string | null;
  stationStreamUrl: string;
  listenedAt: string;
  duration: number;
  createdAt: string;
}
