<script setup lang="ts">
import { Loader2, Search, X } from 'lucide-vue-next'

defineProps<{
  isLoading: boolean
}>()

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="search-field">
    <Search stroke-width="1" :size="16" class="search-icon" />
    <input
      v-model="model"
      aria-label="Search stations"
      type="text"
      placeholder="Search stations..."
      class="search-input"
    />
    <button
      v-if="model"
      type="button"
      class="search-clear"
      aria-label="Clear search"
      :disabled="isLoading"
      @click="model = ''"
    >
      <Loader2 stroke-width="1.5" :size="14" class="spinner" v-if="isLoading" />
      <X stroke-width="1.5" :size="14" v-else />
    </button>
  </div>
</template>

<style scoped lang="scss">
.search-field {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--minimal-subtle);
  pointer-events: none;
}

.search-input {
  flex: 1;
  padding: 10px 36px 10px 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: #ffffff;
  color: var(--minimal-ink);
  font-family: var(--font-minimal);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease;
}

.search-input::placeholder {
  color: var(--minimal-subtle);
}

.search-input:focus {
  border-color: var(--minimal-muted);
}

.search-clear {
  position: absolute;
  right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-full);
  background: none;
  color: var(--minimal-subtle);
  cursor: pointer;
  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.search-clear:hover {
  color: var(--minimal-ink);
  background: var(--minimal-bg-selected);
}

.spinner {
  animation: spin 0.6s linear infinite;
}
</style>
