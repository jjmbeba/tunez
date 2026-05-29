import { computed, onScopeDispose, ref, watch } from 'vue'

interface UseDebouncedSearchQueryOptions {
  debounceMs?: number
  minLength?: number
}

export function useDebouncedSearchQuery(options: UseDebouncedSearchQueryOptions = {}) {
  const { debounceMs = 300, minLength = 2 } = options

  const query = ref('')
  const debouncedQuery = ref('')

  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(query, (value) => {
    if (debounceTimer) clearTimeout(debounceTimer)

    debounceTimer = setTimeout(() => {
      debouncedQuery.value = value
    }, debounceMs)
  })

  onScopeDispose(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
  })

  const isActive = computed(() => debouncedQuery.value.length >= minLength)

  return { query, debouncedQuery, isActive }
}
