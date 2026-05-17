<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const query = ref("");
const router = useRouter();

function search() {
  const q = query.value.trim();

  if (q) {
    router.push(`/artists/${encodeURIComponent(q)}`);
  }
}
</script>

<template>
  <section class="artist-search">
    <h1>Artists</h1>
    <form class="search-form" @submit.preven="search">
      <input
        v-model="query"
        type="text"
        placeholder="Search for an artist..."
        class="search-input"
      />
      <button type="submit" class="search-btn">Search</button>
    </form>
    <p class="hint">Try: Nyashinski, Sauti Sol, Kendrick Lamar</p>
  </section>
</template>

<style lang="scss" scoped>
.artist-search {
  max-width: 36rem;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

h1 {
  font-size: 1.5rem;
  margin-bottom: var(--space-6);
}

.search-form {
  display: flex;
  gap: var(--space-2);
}

.search-input {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-muted);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
}

.search-btn {
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-accent);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.hint {
  margin-top: var(--space-6);
  color: var(--color-muted);
  font-size: 0.875rem;
}
</style>
