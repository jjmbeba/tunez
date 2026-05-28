<script setup lang="ts">
import AppBottomNav from "./AppBottomNav.vue";
import AppHeaderMobile from "./app-header-mobile.vue";
import AppSidebar from "./app-sidebar.vue";
import PersistentPlayer from "./persistent-player.vue";
</script>

<template>
  <div class="app-layout">
    <div class="app-layout__inner">
      <AppSidebar />
      <div class="app-body">
        <AppHeaderMobile />
        <main class="scrollable-content">
          <RouterView />
        </main>
        <AppBottomNav />
      </div>
    </div>
    <PersistentPlayer />
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  --player-height: 64px;
  --bottom-nav-height: 56px;
  --mobile-chrome-bottom: calc(var(--player-height) + var(--bottom-nav-height));
  --desktop-chrome-bottom: var(--player-height);

  min-height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-layout__inner {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}

.app-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  padding-bottom: var(--mobile-chrome-bottom);

  @media (min-width: 1024px) {
    padding-bottom: var(--desktop-chrome-bottom);
  }
}
</style>
