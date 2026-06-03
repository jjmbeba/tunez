<script setup lang="ts">
import { computed } from 'vue'
import { Heart } from 'lucide-vue-next'
import { useFavoritesStore } from '@/stores/favorites'
import type { PlayableStation } from '@/shared/types/station'

const props = withDefaults(
  defineProps<{
    station: PlayableStation
    variant?: 'default' | 'cover'
  }>(),
  { variant: 'default' },
)

const store = useFavoritesStore()
const isFavorited = computed(() => store.isFavorited(props.station.id))
const isPending = computed(() => store.isPending(props.station.id))
const iconSize = computed(() => (props.variant === 'cover' ? 16 : 14))

async function handleToggle() {
  await store.toggleFavorite(props.station)
}
</script>

<template>
  <button
    type="button"
    class="fav-btn"
    :class="{ 'fav-btn--cover': variant === 'cover', 'fav-btn--active': isFavorited }"
    :aria-label="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
    :aria-pressed="isFavorited"
    :disabled="isPending"
    @click.stop="handleToggle"
  >
    <Heart stroke-width="1.5" :size="iconSize" :fill="isFavorited ? 'currentColor' : 'none'" />
  </button>
</template>

<style scoped lang="scss">
@use '../styles/favorite';
</style>
