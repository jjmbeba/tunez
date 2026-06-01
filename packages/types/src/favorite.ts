export interface Favorite {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  stationFavicon: string | null;
  stationStreamUrl: string;
  createdAt: string;
}
