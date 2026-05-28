<script setup lang="ts"></script>

<template>
  <section class="favorites-page">
    <h1>Favorites</h1>
    <p class="hint">Your favorite tracks will appear here.</p>
  </section>
</template>

<style scoped lang="scss">
.favorites-page {
  padding: var(--space-8) var(--space-6);
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-4);
  letter-spacing: -0.015em;
}

.hint {
  color: var(--color-muted);
  font-size: 13px;
}
</style>
