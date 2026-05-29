<script setup lang="ts">
import type { Station } from "@tunes/types";
import FallbackArtwork from "@/shared/components/fallback-artwork.vue";
import { ThumbsUp, Play } from "lucide-vue-next";

defineProps<{
  station: Station;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();
</script>

<template>
  <button class="station-card" type="button" @click="emit('select', station.id)">
    <div class="card-cover">
      <FallbackArtwork :src="station.favicon" :alt="station.name" icon="Radio" :size="24" />
      <div class="card-play">
        <Play stroke-width="1.5" :size="20" />
      </div>
    </div>
    <div class="card-body">
      <p class="card-name">{{ station.name }}</p>
      <div v-if="station.tags?.length" class="card-tags">
        <span v-for="tag in station.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="card-footer">
        <div class="card-votes">
          <ThumbsUp stroke-width="1" :size="10" />
          <span>{{ station.votes }}</span>
        </div>
      </div>
    </div>
  </button>
</template>

<style scoped lang="scss">
@use "../styles/card";
</style>
