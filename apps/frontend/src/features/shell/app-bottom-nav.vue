<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Heart, Home, Radio } from "lucide-vue-next";
</script>

<template>
  <nav class="bottom-nav" aria-label="Primary">
    <RouterLink to="/" class="bottom-nav-link">
      <Home stroke-width="1.5" :size="20" />
      <span>Home</span>
    </RouterLink>
    <RouterLink to="/radio" class="bottom-nav-link">
      <Radio stroke-width="1.5" :size="20" />
      <span>Radio</span>
    </RouterLink>
    <RouterLink to="/favorites" class="bottom-nav-link">
      <Heart stroke-width="1.5" :size="20" />
      <span>Favorites</span>
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.bottom-nav {
  display: flex;
  flex-shrink: 0;
  height: var(--bottom-nav-height, 56px);
  align-items: stretch;
  justify-content: space-around;
  background: #ffffff;
  border-top: 1px solid var(--minimal-border);
  z-index: 150;

  @media (min-width: 1024px) {
    display: none;
  }
}

.bottom-nav-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--minimal-muted);
  text-decoration: none;
  font-size: 10px;
  font-weight: 500;
  transition: color 0.2s;

  &:hover,
  &.router-link-active {
    color: var(--minimal-ink);
  }
}
</style>
