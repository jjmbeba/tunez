<script setup lang="ts">
import { Disc3, Music, Play } from "lucide-vue-next";
import { useArtistAlbums } from "@/composables/use-artist";

const { name } = defineProps<{
  name: string;
}>();

const { data: albums, isLoading: isAlbumsLoading } = useArtistAlbums(name);
</script>

<template>
  <section v-if="albums?.length" class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Disc3 stroke-width="1" :size="16" />
        <span>Discography</span>
      </h2>
    </div>

    <div v-if="isAlbumsLoading" class="state">Loading albums...</div>
    <div v-else class="album-grid">
      <div v-for="album in albums" :key="album.id" class="album-card" tabindex="0">
        <div class="album-cover">
          <img
            v-if="album.image"
            :src="album.image"
            :alt="album.title"
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

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
  gap: 20px;
}

.album-card {
  cursor: pointer;
  border-radius: 6px;
  padding: 6px;
  margin: -6px;
  transition: background 0.15s ease;
}

.album-card:hover,
.album-card:focus {
  background: var(--color-surface);
  outline: none;
}

.album-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.album-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.album-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.album-play {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.album-play :deep(svg) {
  color: #ffffff;
}

.album-card:hover .album-play,
.album-card:focus .album-play {
  opacity: 1;
}

.album-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .album-grid {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 16px;
  }
}
</style>
