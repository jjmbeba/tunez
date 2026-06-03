<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  bio: string
}>()

const expanded = ref(false)
const showToggle = computed(() => props.bio.length > 280)
</script>

<template>
  <div v-if="bio" class="bio-block">
    <p class="bio" :class="{ clamped: !expanded && showToggle }">{{ bio }}</p>
    <button v-if="showToggle" type="button" class="bio-toggle" @click="expanded = !expanded">
      {{ expanded ? 'Show less' : 'Read more' }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.bio-block {
  margin-bottom: 40px;
  max-width: 640px;
}

.bio {
  color: var(--minimal-muted);
  font-size: 14px;
  line-height: 1.65;
  margin: 0;
  white-space: pre-line;
}

.bio.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bio-toggle {
  margin-top: 8px;
  padding: 0;
  border: none;
  background: none;
  color: var(--color-text);
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;

  &:hover {
    color: var(--minimal-muted);
  }
}
</style>
