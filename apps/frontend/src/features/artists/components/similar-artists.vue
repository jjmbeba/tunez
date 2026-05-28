<script setup lang="ts">
import { ChevronRight, Radio, Users } from "lucide-vue-next";
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
    <div v-else class="similar-list">
      <button v-for="s in similar" :key="s.name" class="similar-item" @click="goToArtist(s.name)">
        <div class="similar-avatar">
          <img
            v-if="s.image"
            :src="s.image"
            :alt="s.name"
            @error="(e) => ((e.target as HTMLImageElement).style.display = 'none')"
          />
          <div v-else class="similar-avatar-placeholder">
            <Radio stroke-width="1" :size="12" />
          </div>
        </div>
        <span class="similar-name">{{ s.name }}</span>
        <ChevronRight stroke-width="1" :size="12" class="similar-chevron" />
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "../styles/section-shared";

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.similar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 10px;
  margin: 0 -10px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text);
  font-family: inherit;
  font-size: 13px;
  text-align: left;
  transition: background 0.15s ease;
}

.similar-item:hover {
  background: var(--color-surface);
}

.similar-avatar {
  width: 36px;
  height: 36px;
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
  flex: 1;
  font-weight: 500;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.similar-chevron {
  color: var(--color-muted);
  flex-shrink: 0;
}
</style>
