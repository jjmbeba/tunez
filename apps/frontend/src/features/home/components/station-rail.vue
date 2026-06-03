<script setup lang="ts">
import { WifiOff } from "lucide-vue-next";
import StationCard from "@/features/radio/components/station-card.vue";
import type { StationCardStation } from "@/features/radio/station-card.types";

defineProps<{
  title: string;
  stations?: StationCardStation[] | null;
  isLoading?: boolean;
  isError?: boolean;
  error?: unknown;
  skeletonCount?: number;
}>();

const emit = defineEmits<{
  select: [id: string];
}>();
</script>

<template>
  <section class="station-rail">
    <header class="station-rail__header">
      <h2 class="station-rail__title">{{ title }}</h2>
    </header>

    <div v-if="isLoading" class="station-rail__track" aria-hidden="true">
      <div v-for="n in skeletonCount ?? 6" :key="n" class="station-rail__item">
        <div class="skeleton-card">
          <div class="skeleton-cover" />
          <div class="skeleton-body">
            <div class="skeleton-line skeleton-line--wide" />
            <div class="skeleton-line skeleton-line--narrow" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="isError" class="state state-error station-rail__state">
      <WifiOff stroke-width="1" :size="24" />
      <p class="state-title">We couldn’t load {{ title.toLowerCase() }} right now.</p>
      <p class="state-desc">
        {{
          error instanceof Error && error.message
            ? `Please try again. ${error.message}`
            : "Please try again in a moment."
        }}
      </p>
    </div>

    <div v-else class="station-rail__track">
      <div v-for="station in stations" :key="station.id" class="station-rail__item">
        <StationCard :station="station" @select="(id) => emit('select', id)" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/state";

.station-rail {
  display: grid;
  gap: 14px;
}

.station-rail__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.station-rail__title {
  margin: 0;
  color: var(--minimal-ink);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.station-rail__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(168px, 180px);
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
  overscroll-behavior-x: contain;

  &::-webkit-scrollbar {
    display: none;
  }
}

.station-rail__item {
  min-width: 0;
}

.skeleton-card {
  display: flex;
  flex-direction: column;
}

.skeleton-cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-body {
  padding: 8px 2px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.skeleton-line {
  height: 12px;
  border-radius: 4px;
  background: var(--color-surface);
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-line--wide {
  width: 80%;
}

.skeleton-line--narrow {
  width: 50%;
}

.station-rail__state {
  padding: 32px 24px;
  border: 1px solid var(--minimal-border);
  border-radius: var(--radius-lg);
  background: var(--minimal-bg-selected);
}

@media (min-width: 768px) {
  .station-rail__track {
    grid-auto-columns: minmax(184px, 190px);
  }
}
</style>
