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
    <form class="search-form" @submit.prevent="search">
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

<style scoped lang="scss">
.artist-search {
  max-width: 36rem;
  margin: 0 auto;
  padding: var(--space-8) var(--space-4);
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--minimal-ink);
  margin-bottom: var(--space-6);
  letter-spacing: -0.015em;
}

.search-form {
  display: flex;
  gap: var(--space-2);
}

.search-input {
  flex: 1;
  padding: 10px 14px;
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

.search-btn {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: var(--minimal-ink);
  color: #ffffff;
  font-family: var(--font-minimal);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.search-btn:hover {
  opacity: 0.85;
}

.hint {
  margin-top: var(--space-6);
  color: var(--minimal-subtle);
  font-size: 12px;
}
</style>
