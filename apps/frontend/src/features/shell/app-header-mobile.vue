<script setup lang="ts">
import { RouterLink } from "vue-router";
import { Search, User } from "lucide-vue-next";
</script>

<template>
  <header class="mobile-header">
    <RouterLink to="/" class="shell-wordmark">Tunez</RouterLink>
    <div class="mobile-header-actions">
      <button type="button" class="icon-btn" aria-label="Search">
        <Search stroke-width="1.5" :size="20" />
      </button>
      <RouterLink to="/profile" class="icon-btn" aria-label="Profile">
        <User stroke-width="1.5" :size="20" />
      </RouterLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use "./nav";

.mobile-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 1rem;
  background: #ffffff;
  border-bottom: 1px solid var(--minimal-border);
  z-index: 100;

  @media (min-width: 1024px) {
    display: none;
  }
}

.mobile-header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  background: none;
  color: var(--minimal-muted);
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s, background 0.2s;

  &:hover {
    color: var(--minimal-ink);
    background: var(--minimal-bg-selected);
  }
}
</style>
