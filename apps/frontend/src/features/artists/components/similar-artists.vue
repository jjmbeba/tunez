<script setup lang="ts">
import { Radio, Users } from "lucide-vue-next";
import { useArtistSimilar } from "@/composables/use-artist";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{
  name: string;
}>();

const { data: similar, isLoading: isSimilarLoading } = useArtistSimilar(props.name);

function goToArtist(artistName: string) {
  router.push(`/artists/${encodeURIComponent(artistName)}`);
}
</script>

<template>
  <section v-if="similar?.length" class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Users stroke-width="1" :size="16" />
        <span>Fans also like</span>
      </h2>
    </div>

    <div v-if="isSimilarLoading" class="state">Loading...</div>
    <div v-else class="similar-carousel">
      <button
        v-for="s in similar"
        :key="s.name"
        type="button"
        class="similar-card"
        @click="goToArtist(s.name)"
      >
        <div class="similar-avatar">
          <img
            v-if="s.image"
            :src="s.image"
            :alt="s.name"
            loading="lazy"
            @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
          />
          <div v-else class="similar-avatar-placeholder">
            <Radio stroke-width="1" :size="14" />
          </div>
        </div>
        <span class="similar-name">{{ s.name }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/section-shared";

.similar-carousel {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  min-height: 120px;
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

.similar-card {
  flex: 0 0 auto;
  width: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 6px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text);
  font-family: inherit;
  scroll-snap-align: start;
  transition: background 0.15s ease;

  &:hover {
    background: var(--color-surface);
  }
}

.similar-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--color-surface);
  border: 1px solid var(--minimal-border);
}

.similar-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.similar-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}

.similar-name {
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
</style>
