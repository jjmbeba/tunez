<script setup lang="ts">
import { useArtist } from "@/composables/use-artist";
import ArtistAlbums from "@/features/artists/components/artist-albums.vue";
import ArtistBio from "@/features/artists/components/artist-bio.vue";
import ArtistProfileShell from "@/features/artists/components/artist-profile-shell.vue";
import SimilarArtists from "@/features/artists/components/similar-artists.vue";
import { ArrowLeft, Headphones, Music } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const name = route.params.name as string;
const { data: artist, isLoading: isArtistLoading, error } = useArtist(name);

function goBack() {
  router.push("/artists");
}
</script>

<template>
  <ArtistProfileShell>
    <section class="minimal">
      <button class="back" type="button" @click="goBack">
        <ArrowLeft stroke-width="1" :size="14" />
        <span>Artists</span>
      </button>

      <div v-if="isArtistLoading" class="hero-skeleton">
        <div class="skeleton-image" />
        <div class="skeleton-info">
          <div class="skeleton-line skeleton-line--wide" />
          <div class="skeleton-line skeleton-line--medium" />
          <div class="skeleton-tags">
            <span class="skeleton-tag" />
            <span class="skeleton-tag" />
            <span class="skeleton-tag" />
          </div>
        </div>
      </div>
      <div v-else-if="error" class="state error">{{ error }}</div>

      <template v-else-if="artist">
        <header class="hero">
          <div class="hero-media">
            <img
              v-if="artist.image"
              :src="artist.image"
              :alt="artist.name"
              class="hero-image"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <div v-else class="hero-image-placeholder">
              <Music stroke-width="1" :size="32" />
            </div>
          </div>

          <div class="hero-info">
            <h1 class="hero-name">{{ artist.name }}</h1>

            <div class="hero-stats">
              <span class="stat">
                <Headphones stroke-width="1" :size="12" />
                <span>{{ artist.listeners.toLocaleString() }} listeners</span>
              </span>
            </div>

            <div v-if="artist.tags?.length" class="hero-tags">
              <span v-for="tag in artist.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </header>

        <ArtistBio v-if="artist.bio" :bio="artist.bio" />
        <ArtistAlbums :name="name" />
        <SimilarArtists :name="name" />
      </template>
    </section>
  </ArtistProfileShell>
</template>

<style scoped lang="scss">
@use "../../features/artists/styles/section-shared";

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
  margin-bottom: 32px;
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

.state.error {
  color: var(--color-danger);
}

.hero {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
  animation: reveal-up 0.5s ease-out both;
}

.hero-media {
  flex-shrink: 0;
}

.hero-image {
  width: 144px;
  height: 144px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.hero-image-placeholder {
  width: 144px;
  height: 144px;
  border-radius: 8px;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.hero-info {
  min-width: 0;
  padding-top: 4px;
}

.hero-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--color-text);
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.hero-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 14px;
}

.stat {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--minimal-muted);
  font-size: 12px;
  font-weight: 400;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 4px;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
  color: var(--minimal-muted);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.hero-skeleton {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.skeleton-image {
  width: 144px;
  height: 144px;
  border-radius: 8px;
  flex-shrink: 0;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-info {
  flex: 1;
  padding-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line--wide {
  width: 75%;
  height: 24px;
}

.skeleton-line--medium {
  width: 45%;
}

.skeleton-tags {
  display: flex;
  gap: 6px;
  margin-top: 4px;
}

.skeleton-tag {
  width: 48px;
  height: 22px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.25; }
}

@keyframes reveal-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .minimal {
    padding: 16px 20px 40px;
  }

  .hero {
    flex-direction: column;
    gap: 16px;
  }

  .hero-image,
  .hero-image-placeholder {
    width: 120px;
    height: 120px;
  }

  .hero-name {
    font-size: 20px;
  }
}
</style>
