<script setup lang="ts">
import { ArrowLeft, Music, Play } from "lucide-vue-next";
import { useArtistAlbums } from "@/composables/use-artist";
import { useRoute, useRouter } from "vue-router";

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

    <div v-if="isLoading" class="state">Loading albums...</div>
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
            <img
              v-if="album.image"
              :src="album.image"
              :alt="album.title"
              loading="lazy"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <div v-else class="album-cover-placeholder">
              <Music stroke-width="1" :size="24" />
            </div>
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
</style>
