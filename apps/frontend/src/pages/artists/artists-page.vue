<script setup lang="ts">
import { useRouter } from "vue-router";
import { Search } from "lucide-vue-next";
import { useArtistSearch } from "@/composables/use-artist";
import ArtistImage from "@/features/artists/components/artist-image.vue";

const router = useRouter();
const { query, debouncedQuery, showResults, data: results, isLoading, isError, error } =
  useArtistSearch();

function goToArtist(name: string) {
  router.push(`/artists/${encodeURIComponent(name)}`);
}

</script>

<template>
  <section class="artist-search">
    <h1>Artists</h1>

    <div class="search-field">
      <Search stroke-width="1" :size="16" class="search-icon" />
      <input
        v-model="query"
        aria-label="Search for an artist"
        type="text"
        placeholder="Search for an artist..."
        class="search-input"
      />
    </div>

    <div v-if="!showResults" class="state">
      <p class="hint">Try: Nyashinski, Sauti Sol, Kendrick Lamar</p>
    </div>

    <div v-else-if="isLoading" class="results-grid">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-avatar" />
        <div class="skeleton-label" />
      </div>
    </div>

    <div v-else-if="isError" class="state state-error">
      {{ error instanceof Error ? error.message : "Something went wrong" }}
    </div>

    <div v-else-if="results?.length === 0" class="state">
      No artists found for "{{ debouncedQuery }}"
    </div>

    <div v-else class="results-grid">
      <button
        v-for="a in results"
        :key="a.name"
        type="button"
        class="result-card"
        @click="goToArtist(a.name)"
      >
        <div class="result-avatar">
          <ArtistImage :src="a.image" :alt="a.name" icon="Radio" :size="18" />
        </div>
        <span class="result-name">{{ a.name }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.artist-search {
  max-width: 36rem;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--minimal-ink);
  margin-bottom: var(--space-6);
  letter-spacing: -0.015em;
}

.search-field {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--minimal-subtle);
  pointer-events: none;
}

.search-input {
  flex: 1;
  padding: 10px 14px 10px 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: #ffffff;
  color: var(--minimal-ink);
  font-family: var(--font-minimal);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input::placeholder {
  color: var(--minimal-subtle);
}

.search-input:focus {
  border-color: var(--minimal-muted);
}

.state {
  text-align: center;
  color: var(--color-muted);
  padding: 48px 0;
  font-size: 13px;
}

.state-error {
  color: #d32f2f;
}

.hint {
  margin: 0;
  font-size: 12px;
}

.results-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-block-start: var(--space-6);
}

.result-card {
  flex: 0 0 auto;
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text);
  font-family: inherit;
  transition: background 0.15s ease;
}

.result-card:hover {
  background: var(--color-surface);
}

.result-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.result-name {
  width: 100%;
  min-height: 2.6em;
  max-height: 2.6em;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.skeleton-card {
  width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-label {
  width: 64px;
  height: 11px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}


</style>
