<script setup lang="ts">
import { ExternalLink, Globe, Headphones, Play, Radio } from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStation } from "@/composables/use-station";
import DetailSheetShell from "@/features/shell/detail-sheet-shell.vue";
import FallbackArtwork from "@/shared/components/fallback-artwork.vue";
import BackLink from "@/shared/components/back-link.vue";
import FavoriteToggle from "@/features/favorites/components/favorite-toggle.vue";
import { useAudioStore } from "@/stores/audio";

const route = useRoute();
const id = computed(() => route.params.id as string);
const { data: station, isLoading, error } = useStation(id);
const audioStore = useAudioStore();
</script>

<template>
  <DetailSheetShell fallback-route="/radio">
    <section class="page">
      <div class="page-back-link">
        <BackLink to="/radio" label="Radio" />
      </div>

      <div v-if="isLoading" class="hero-skeleton">
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

      <div v-else-if="error" class="state error">
        Failed to load station details. Please try again.
      </div>

      <template v-else-if="station">
        <header class="hero">
          <div class="hero-media">
            <FallbackArtwork :src="station.favicon" :alt="station.name" :text="station.name" />
          </div>

          <div class="hero-info">
            <h1 class="hero-name">{{ station.name }}</h1>

            <div v-if="station.tags?.length" class="hero-tags">
              <span v-for="tag in station.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </header>

        <div class="stats">
          <span v-if="station.codec" class="stat">
            <Radio stroke-width="1" :size="12" />
            <span>
              {{ station.codec }}
              <template v-if="station.bitrate">
                &middot; {{ station.bitrate }} kbps
              </template>
            </span>
          </span>
          <span v-if="station.language" class="stat">
            <Globe stroke-width="1" :size="12" />
            <span>{{ station.language }}</span>
          </span>
          <span class="stat">
            <Headphones stroke-width="1" :size="12" />
            <span>{{ station.votes.toLocaleString() }} votes</span>
          </span>
        </div>

        <div class="actions">
          <button type="button" class="btn-play" @click="audioStore.play(station)">
            <Play stroke-width="1.5" :size="16" />
            <span>Play</span>
          </button>
          <a
            v-if="station.homepage"
            :href="station.homepage"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-external"
          >
            <ExternalLink stroke-width="1.5" :size="14" />
            <span>Website</span>
          </a>
          <FavoriteToggle :station="station" />
        </div>
      </template>
    </section>
  </DetailSheetShell>
</template>

<style scoped lang="scss">
@use "@/shared/styles/page";
@use "@/shared/styles/state";
@use "../../features/radio/styles/detail";

.error {
  color: var(--color-danger);
}

.page-back-link {
  margin-bottom: 32px;
}
</style>
