<script setup lang="ts">
import { Radio } from 'lucide-vue-next'
import StationGrid from '@/features/radio/components/station-grid.vue'
import type { StationCardStation } from '@/features/radio/station-card.types'

defineProps<{
  // Thin presentation wrapper around StationGrid; keep its stations contract aligned.
  stations: StationCardStation[] | null | undefined
  isLoading: boolean
  isError: boolean
  error: unknown
}>()

const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <section class="section">
    <div class="section-header">
      <h2 class="section-title">
        <Radio stroke-width="1" :size="16" />
        <span>Top Stations</span>
      </h2>
    </div>

    <StationGrid
      :stations="stations"
      :is-loading="isLoading"
      :is-error="isError"
      :error="error"
      empty-message="The current station feed has no clear tag match for this genre."
      @select="(id) => emit('select', id)"
    />
  </section>
</template>

<style scoped lang="scss">
@use '../styles/section-shared';
</style>
