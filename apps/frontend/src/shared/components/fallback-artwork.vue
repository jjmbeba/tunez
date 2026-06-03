<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    text?: string
  }>(),
  { text: undefined },
)

const imgError = ref(false)

watch(
  () => props.src,
  () => {
    imgError.value = false
  },
)

const PALETTE: ReadonlyArray<readonly [string, string]> = [
  ['#475569', '#1e293b'],
  ['#57534e', '#1c1917'],
  ['#4b5563', '#111827'],
  ['#5b5b5b', '#1f1f1f'],
  ['#52525b', '#18181b'],
  ['#3f3f46', '#0a0a0a'],
] as const

function hashString(input: string): number {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return hash >>> 0
}

const fallbackText = computed(() => props.text ?? props.alt)

const initials = computed(() => {
  const cleaned = fallbackText.value.replace(/[^A-Za-z0-9]/g, '')
  if (!cleaned) return '?'
  const first = cleaned[0]?.toUpperCase() ?? ''
  const second = cleaned[1]?.toUpperCase()
  return second ? `${first}${second}` : first
})

const gradient = computed(() => {
  const pair = PALETTE[hashString(fallbackText.value) % PALETTE.length]!
  return `linear-gradient(135deg, ${pair[0]} 0%, ${pair[1]} 100%)`
})
</script>

<template>
  <img v-if="src && !imgError" :src="src" :alt="alt" loading="lazy" @error="imgError = true" />
  <div v-else class="artwork-tile" :style="{ background: gradient }" :aria-label="alt" role="img">
    <span class="artwork-initials">{{ initials }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/artwork';

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
