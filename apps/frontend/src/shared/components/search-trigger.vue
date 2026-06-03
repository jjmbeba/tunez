<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useSearchStore } from '@/stores/search'

withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const searchStore = useSearchStore()
</script>

<template>
  <button
    type="button"
    class="search-trigger"
    :class="{ 'search-trigger--compact': compact }"
    :aria-label="compact ? 'Search music' : undefined"
    @click="searchStore.open"
  >
    <Search stroke-width="1.5" :size="compact ? 20 : 16" />
    <span v-if="!compact" class="search-trigger__label">Search music</span>
    <kbd v-if="!compact" class="search-trigger__shortcut">Ctrl K</kbd>
  </button>
</template>

<style scoped lang="scss">
.search-trigger {
  display: flex;
  width: 100%;
  min-height: 40px;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0.625rem;
  border: 1px solid var(--minimal-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--minimal-muted);
  font-family: var(--font-minimal);
  font-size: 0.8125rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    background 0.2s,
    color 0.2s;

  &:hover,
  &:focus-visible {
    border-color: #dedede;
    background: #ffffff;
    color: var(--minimal-ink);
  }

  &:focus-visible {
    outline: 2px solid var(--minimal-ink);
    outline-offset: 2px;
  }
}

.search-trigger--compact {
  width: 40px;
  height: 40px;
  min-height: 40px;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  border-radius: var(--radius-md);
}

.search-trigger__label {
  min-width: 0;
  flex: 1;
  text-align: left;
}

.search-trigger__shortcut {
  flex-shrink: 0;
  padding: 2px 5px;
  border: 1px solid var(--minimal-border);
  border-radius: 5px;
  color: var(--minimal-subtle);
  background: #ffffff;
  font-family: var(--font-minimal);
  font-size: 10px;
  font-weight: 500;
}
</style>
