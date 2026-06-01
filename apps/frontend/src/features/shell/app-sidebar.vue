<script setup lang="ts">
import { MusicIcon } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>

<template>
  <aside class="sidebar">
    <RouterLink to="/" class="shell-wordmark">
      Tunez
      <MusicIcon />
    </RouterLink>

    <div class="search-placeholder" aria-hidden="true">
      <span class="search-placeholder-text">Search (Phase)</span>
    </div>

    <nav class="nav-primary" aria-label="Primary">
      <RouterLink to="/" class="shell-nav-link">Home</RouterLink>
      <RouterLink to="/radio" class="shell-nav-link">Radio</RouterLink>
      <RouterLink to="/favorites" class="shell-nav-link">Favorites</RouterLink>
    </nav>

    <hr class="divider" />

    <nav class="nav-secondary" aria-label="Secondary">
      <RouterLink to="/genres" class="shell-nav-link">Genres</RouterLink>
      <RouterLink to="/artists" class="shell-nav-link">Artists</RouterLink>
      <RouterLink to="/profile" class="shell-nav-link">Profile</RouterLink>
    </nav>
  </aside>
</template>

<style scoped lang="scss">
@use "./nav";

.sidebar {
  display: none;
  flex-direction: column;
  width: 240px;
  flex-shrink: 0;
  padding: 1rem 0.75rem;
  background: #ffffff;
  border-right: 1px solid var(--minimal-border);
  gap: 0.75rem;
}

@media (min-width: 1024px) {
  .sidebar {
    display: flex;
  }
}

.search-placeholder {
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--minimal-border);
  background: var(--color-surface);
}

.search-placeholder-text {
  font-size: 0.8125rem;
  color: var(--minimal-subtle);
}

.nav-primary,
.nav-secondary {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.divider {
  border: none;
  border-top: 1px solid var(--minimal-border);
  margin: 0.25rem 0;
}
</style>
