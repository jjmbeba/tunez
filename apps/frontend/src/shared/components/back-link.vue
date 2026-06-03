<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to: string
    label?: string
  }>(),
  { label: 'Back' },
)

const router = useRouter()

function go() {
  if (window.history.length > 1) {
    router.back()
    return
  }

  router.push(props.to)
}
</script>

<template>
  <button type="button" class="back-link" @click="go">
    <ArrowLeft stroke-width="1" :size="14" />
    <span>{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
@use '../styles/page';
</style>
