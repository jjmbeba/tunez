<template>
  <footer class="player-bar">
    <div class="player-track">
      <span class="player-placeholder-text">Player</span>
    </div>
    <div class="player-controls">
      <button class="player-btn" type="button" aria-label="previous">&#9664;&#9664;</button>
      <button class="player-btn play" type="button" aria-label="play">&#9654;</button>
      <button class="player-btn" type="button" aria-label="next">&#9654;&#9654;</button>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.player-bar {
  flex-shrink: 0;
  height: var(--player-height, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 1.25rem;
  background: #ffffff;
  border-top: 1px solid var(--minimal-border);
  z-index: 200;
}

.player-track {
  flex: 1;
  min-width: 0;
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
