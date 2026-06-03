import { computed, onMounted, ref } from "vue";
import { useStations } from "@/composables/use-stations";
import type { StationCardStation } from "@/features/radio/station-card.types";
import { useFavoritesStore } from "@/stores/favorites";
import { useHistoryStore } from "@/stores/history";
import type { ListeningHistory } from "@tunes/types";

const TRENDING_LIMIT = 8;
const RECENT_FETCH_LIMIT = 10;
const RECENT_LIMIT = 5;
const FAVORITES_LIMIT = 8;

function mapRecentStations(entries: ListeningHistory[]): StationCardStation[] {
  const seenStationIds = new Set<string>();
  const stations: StationCardStation[] = [];

  for (const entry of entries) {
    if (seenStationIds.has(entry.stationId)) {
      continue;
    }

    seenStationIds.add(entry.stationId);
    stations.push({
      id: entry.stationId,
      name: entry.stationName,
      streamUrl: entry.stationStreamUrl,
      favicon: entry.stationFavicon || "",
      tags: [],
    });

    if (stations.length >= RECENT_LIMIT) {
      break;
    }
  }

  return stations;
}

export function useHomeFeed() {
  const historyStore = useHistoryStore();
  const favoritesStore = useFavoritesStore();
  const hasLoadedRecent = ref(false);
  const hasLoadedFavorites = ref(false);

  const {
    data: stationResults,
    isLoading: isTrendingLoading,
    isError: isTrendingError,
    error: trendingError,
  } = useStations();

  const trendingStations = computed<StationCardStation[]>(() =>
    (stationResults.value ?? []).slice(0, TRENDING_LIMIT),
  );

  const recentStations = computed<StationCardStation[]>(() =>
    mapRecentStations(historyStore.recentEntries),
  );

  const favoriteStations = computed<StationCardStation[]>(() =>
    favoritesStore.favorites.slice(0, FAVORITES_LIMIT).map((favorite) => ({
      id: favorite.stationId,
      name: favorite.stationName,
      streamUrl: favorite.stationStreamUrl,
      favicon: favorite.stationFavicon || "",
      tags: [],
    })),
  );

  const showRecentStations = computed(
    () => hasLoadedRecent.value && recentStations.value.length > 0,
  );

  const showFavoriteStations = computed(
    () => hasLoadedFavorites.value && favoriteStations.value.length > 0,
  );

  onMounted(() => {
    void historyStore
      .fetchRecent(RECENT_FETCH_LIMIT)
      .catch(() => undefined)
      .finally(() => {
        hasLoadedRecent.value = true;
      });
    void favoritesStore
      .ensureLoaded()
      .catch(() => undefined)
      .finally(() => {
        hasLoadedFavorites.value = true;
      });
  });

  return {
    trendingStations,
    isTrendingLoading,
    isTrendingError,
    trendingError,
    recentStations,
    showRecentStations,
    favoriteStations,
    showFavoriteStations,
  };
}
