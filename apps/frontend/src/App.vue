<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <RouterLink to="/" class="wordmark">Tunez</RouterLink>
      <nav class="nav">
        <RouterLink to="/radio" class="nav-link">Radio</RouterLink>
        <RouterLink to="/artists" class="nav-link">Artists</RouterLink>
        <RouterLink to="/genres" class="nav-link">Genres</RouterLink>
        <RouterLink to="/favorites" class="nav-link">Favorites</RouterLink>
      </nav>
      <div class="header-extra"></div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="player-bar">
      <div class="player-track">
        <span class="player-placeholder-text">Player (Phase 2)</span>
      </div>
      <div class="player-controls">
        <button class="player-btn" aria-label="previous">&#9664;&#9664;</button>
        <button class="player-btn play" aria-label="play">&#9654;</button>
        <button class="player-btn" aria-label="next">&#9654;&#9654;</button>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.25rem;
  background: #ffffff;
  border-bottom: 1px solid var(--minimal-border);
}

.wordmark {
  font-family: var(--font-minimal);
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--minimal-ink);
  text-decoration: none;
  letter-spacing: -0.015em;
}

.nav {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 0.875rem;
  border-radius: var(--radius-md);
  color: var(--minimal-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.2s, background 0.2s;
}

.nav-link:hover {
  color: var(--minimal-ink);
  background: var(--minimal-bg-selected);
}

.router-link-active {
  color: var(--minimal-ink);
  background: var(--minimal-bg-selected);
}

.header-extra {
  display: flex;
  align-items: center;
  min-width: 80px;
  justify-content: flex-end;
}

.app-main {
  min-height: 0;
}

.player-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.625rem 1.25rem;
  background: #ffffff;
  border-top: 1px solid var(--minimal-border);
}

.player-track {
  flex: 1;
}

.player-placeholder-text {
  color: var(--minimal-subtle);
  font-size: 0.8125rem;
}

.player-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.player-btn {
  background: none;
  border: none;
  color: var(--minimal-subtle);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
}

.player-btn:hover {
  color: var(--minimal-ink);
}

.player-btn.play {
  color: var(--minimal-ink);
  font-size: 1rem;
}
</style>
