<script setup lang="ts">
import { ChevronRight, Disc3, Music, Play } from "lucide-vue-next";
import { useArtistAlbums } from "@/composables/use-artist";
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  name: string;
}>();

const MAX_ALBUMS = 12;

const { data: albums, isLoading: isAlbumsLoading } = useArtistAlbums(props.name);

const previewAlbums = computed(() => {
  const list = albums.value;

  return list ? list.slice(0, MAX_ALBUMS) : [];
});

const showSeeAll = computed(() => (albums.value?.length ?? 0) > MAX_ALBUMS);
</script>

<template>
  <section v-if="albums?.length" class="section">
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

    <div v-if="isAlbumsLoading" class="state">Loading albums...</div>
    <div v-else class="album-carousel">
      <div v-for="album in previewAlbums" :key="album.id" class="album-card" tabindex="0">
        <div class="album-cover">
          <img
            v-if="album.image"
            :src="album.image"
            :alt="album.title"
            loading="lazy"
            @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
          />
          <div v-else class="album-cover-placeholder">
            <Music stroke-width="1" :size="18" />
          </div>
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

.album-carousel {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 132px;
  overflow-x: auto;
  overflow-y: hidden;
  padding-inline-end: 8px;
  scroll-snap-type: x proximity;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: var(--radius-full);
  }

  @media (hover: hover) {
    &:hover {
      scrollbar-color: rgba(0, 0, 0, 0.12) transparent;

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.12);
      }
    }
  }

  @media (hover: none) {
    scrollbar-color: rgba(0, 0, 0, 0.12) transparent;

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.12);
    }
  }
}

.album-carousel .album-card {
  flex: 0 0 auto;
  width: 140px;
  scroll-snap-align: start;
  margin: 0;
}
</style>
