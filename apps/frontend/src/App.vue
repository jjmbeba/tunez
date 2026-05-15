<script setup lang="ts"></script>

<template>
  <div class="app-shell">
    <header class="app-header">Tunez</header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="player-placeholder">Player (Phase 2)</footer>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr auto;
}
.app-header {
  padding: 1rem;
  font-weight: 700;
}
.app-main {
  padding: 1rem;
}
.player-placeholder {
  padding: 1rem;
  border-top: 1px solid #ddd;
}
</style>
