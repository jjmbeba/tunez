<script setup lang="ts">
import { useArtist, useArtistAlbums, useArtistSimilar } from "@/composables/use-artist";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const name = route.params.name as string;

const { artist, loading, error } = useArtist(name);
const { albums, loading: albumsLoading } = useArtistAlbums(name);
const { similar, loading: similarLoading } = useArtistSimilar(name);

console.log(artist);
</script>

<template>
  <section class="artist-detail">
    <button class="back-btn" @click="router.push('/artists')">Back</button>

    <div v-if="loading" class="state">Loading artist...</div>
    <div v-else-if="error" class="state error">
      {{ error }}
    </div>

    <template v-else-if="artist">
      <header class="artist-header">
        <img
          v-if="artist.image"
          :src="artist.image"
          :alt="artist.name"
          class="artist-image"
          @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
        />
        <div v-else class="artist-image-placeholder">
          {{ artist.name.charAt(0) }}
        </div>

        <div class="artist-info">
          <h1>
            {{ artist.name }}
          </h1>
          <div class="artist-stats">
            <span> {{ artist.listeners.toLocaleString() }} listeners </span>
            <span> {{ artist.playCount.toLocaleString() }} plays </span>
          </div>
          <div class="artist-tags">
            <span v-for="tag in artist.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <p v-if="artist.bio" class="artist-bio">
        {{ artist.bio }}
      </p>

      <section v-if="albums.length" class="section">
        <h2>Albums</h2>
        <div v-if="albumsLoading" class="state">Loading Albums</div>
        <div v-else class="album-grid">
          <div v-for="album in albums" :key="album.id" class="album-card">
            <img
              v-if="album.image"
              :src="album.image"
              :alt="album.title"
              class="album-image"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <div v-else class="album-image-placeholder">
              {{ album.title.charAt(0) }}
            </div>
            <p class="album-title">
              {{ album.title }}
            </p>
          </div>
        </div>
      </section>

      <section v-if="similar.length" class="section">
        <h2>Similar Artists</h2>
        <div v-if="similarLoading" class="state">Loading...</div>
        <div v-else class="similar-grid">
          <button
            v-for="s in similar"
            :key="s.name"
            class="similar-card"
            @click="router.push(`/artists/${encodeURIComponent(s.name)}`)"
          >
            <img
              v-if="s.image"
              :src="s.image"
              :alt="s.name"
              class="similar-image"
              @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
            />
            <div v-else class="similar-image-placeholder">
              {{ s.name.charAt(0) }}
            </div>
            <p class="similar-name">
              {{ s.name }}
            </p>
          </button>
        </div>
      </section>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.back-btn {
  background: none;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  padding: var(--space-2) 0;
  font-size: 0.9rem;
  margin-bottom: var(--space-4);
}

.state {
  text-align: center;
  color: var(--color-muted);
  padding: var(--space-8);
}

.state-error {
  color: var(--color-danger);
}

.artist-header {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.artist-image,
.aritst-image-placeholder {
  width: 128px;
  height: 128px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  flex-shrink: 0;
}

.artist-image-placeholder {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-muted);
}

.artist-info {
  min-width: 0;
}

.artist-info h1 {
  margin: 0 0 var(--space-2);
  font-size: 1.5rem;
}

.artist-stats {
  display: flex;
  gap: var(--space-4);
  color: var(--color-muted);
  font-size: 0.875rem;
  margin-bottom: var(--space-3);
}

.artist-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.tag {
  background: var(--color-surface);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.artist-bio {
  color: var(--color-muted);
  line-height: 1.6;
  margin-bottom: var(--space-8);
}

.section {
  margin-bottom: var(--space-8);
}

.section h2 {
  font-size: 1.125rem;
  margin-bottom: var(--space-4);
}

.album-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--space-4);
}

.album-card {
  text-align: center;
}

.album-image,
.album-image-placeholder {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  object-fit: cover;
  margin-bottom: var(--space-2);
}

.album-image-placeholder {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-muted);
}

.album-title {
  font-size: 0.8125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-3);
}

.similar-card {
  background: none;
  border: none;
  cursor: pointer;
  text-align: center;
  color: var(--color-text);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: background 0.15s;
}

.similar-card:hover {
  background: var(--color-surface);
}

.similar-image,
.similar-image-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto var(--space-2);
}

.similar-image-placeholder {
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-muted);
}

.similar-name {
  font-size: 0.8125rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
