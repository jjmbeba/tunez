<script setup lang="ts">
import { ArrowLeft, Play } from "lucide-vue-next";
import { useArtistAlbums } from "@/composables/use-artist";
import { useRoute, useRouter } from "vue-router";
import ArtistImage from "@/features/artists/components/artist-image.vue";

const route = useRoute();
const router = useRouter();
const name = route.params.name as string;

const { data: albums, isLoading, error } = useArtistAlbums(name);

function goBack() {
  router.push(`/artists/${encodeURIComponent(name)}`);
}
</script>

<template>
  <section class="minimal">
    <button class="back" type="button" @click="goBack">
      <ArrowLeft stroke-width="1" :size="14" />
      <span>Back to artist</span>
    </button>

    <h1 class="page-title">Discography</h1>

    <div v-if="isLoading" class="album-grid">
      <div v-for="n in 8" :key="n" class="skeleton-card">
        <div class="skeleton-cover" />
        <div class="skeleton-label" />
      </div>
    </div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <template v-else-if="albums?.length">
      <div class="album-grid">
        <div
          v-for="album in albums"
          :key="album.id"
          class="album-card"
          tabindex="0"
        >
          <div class="album-cover">
            <ArtistImage :src="album.image" :alt="album.title" icon="Music" :size="24" />
            <div class="album-play">
              <Play stroke-width="1" :size="18" />
            </div>
          </div>
          <p class="album-title">{{ album.title }}</p>
        </div>
      </div>
    </template>

    <div v-else class="state">No albums found.</div>
  </section>
</template>

<style scoped lang="scss">
@use "../../features/artists/styles/album-card";

.minimal {
  min-height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.5;
  padding: 24px 32px 48px;
  max-width: 800px;
  margin: 0 auto;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 8px;
  color: var(--color-muted);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s ease;
}

.back:hover {
  color: var(--color-text);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--color-text);
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.state {
  text-align: center;
  color: var(--color-muted);
  padding: 48px 0;
  font-size: 13px;
}

.state.error {
  color: var(--color-danger);
}

.skeleton-card {
  padding: 6px;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  margin-bottom: 10px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-label {
  width: 80%;
  height: 12px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}


</style>
