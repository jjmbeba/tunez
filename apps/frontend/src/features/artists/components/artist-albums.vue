<script setup lang="ts">
import { ChevronRight, Disc3, Play } from "lucide-vue-next";
import { useArtistAlbums } from "@/composables/use-artist";
import { computed, toRef } from "vue";
import ArtistImage from "@/features/artists/components/artist-image.vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  name: string;
}>();

const MAX_ALBUMS = 12;

const artistName = toRef(props, "name");
const { data: albums, isLoading, error } = useArtistAlbums(artistName);

const previewAlbums = computed(() => {
  const list = albums.value;

  return list ? list.slice(0, MAX_ALBUMS) : [];
});

const showSeeAll = computed(() => (albums.value?.length ?? 0) > MAX_ALBUMS);
</script>

<template>
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Disc3 stroke-width="1" :size="16" />
        <span>Top albums</span>
      </h2>
      <RouterLink
        v-if="showSeeAll"
        :to="`/artists/${encodeURIComponent(name)}/discography`"
        class="see-all"
      >
        See all
        <ChevronRight stroke-width="1" :size="12" />
      </RouterLink>
    </div>

    <div v-if="isLoading" class="state">Loading albums...</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="albums?.length" class="album-carousel">
      <div v-for="album in previewAlbums" :key="album.id" class="album-card">
        <div class="album-cover">
          <ArtistImage :src="album.image" :alt="album.title" icon="Music" :size="18" />
          <div class="album-play">
            <Play stroke-width="1" :size="16" />
          </div>
        </div>
        <p class="album-title">{{ album.title }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/section-shared";
@use "../styles/album-card";
@use "../styles/carousel";

.see-all {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--color-muted);
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.15s ease;

  &:hover {
    color: var(--color-text);
  }
}

.state.error {
  color: var(--color-danger);
}

.album-carousel {
  @include carousel.carousel;
  gap: 12px;
  min-height: 132px;
}

.album-carousel .album-card {
  flex: 0 0 auto;
  width: 140px;
  scroll-snap-align: start;
  margin: 0;
}
</style>
