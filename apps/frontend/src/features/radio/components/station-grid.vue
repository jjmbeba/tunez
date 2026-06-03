<script setup lang="ts">
import { Radio, WifiOff } from 'lucide-vue-next'
import StationCard from './station-card.vue'
import type { StationCardStation } from '../station-card.types'

defineProps<{
  stations: StationCardStation[] | null | undefined
  isLoading: boolean
  isError: boolean
  error?: unknown
  emptyMessage: string
}>()

const emit = defineEmits<{
  select: [id: string]
}>()
</script>

<template>
  <div v-if="isLoading" class="grid">
    <div v-for="n in 6" :key="n" class="skeleton-card">
      <div class="skeleton-cover" />
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-line--wide" />
        <div class="skeleton-line skeleton-line--narrow" />
      </div>
    </div>
  </div>

  <div v-else-if="isError" class="state state-error">
    <WifiOff stroke-width="1" :size="24" />
    <p class="state-title">Couldn't load stations</p>
    <p class="state-desc">
      {{ error instanceof Error ? error.message : 'Something went wrong' }}
    </p>
  </div>

  <div v-else-if="!stations?.length" class="state state-empty">
    <Radio stroke-width="1" :size="24" />
    <p class="state-title">No stations found</p>
    <p class="state-desc">{{ emptyMessage }}</p>
  </div>

  <div v-else class="grid">
    <StationCard
      v-for="s in stations"
      :key="s.id"
      :station="s"
      @select="(id) => emit('select', id)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/shared/styles/state';
@use '../styles/grid';
</style>
