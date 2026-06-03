<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AppBottomNav from './app-bottom-nav.vue'
import AppHeaderMobile from './app-header-mobile.vue'
import AppSidebar from './app-sidebar.vue'
import PersistentPlayer from './persistent-player.vue'
import GlobalSearchDialog from '@/shared/components/global-search-dialog.vue'
import ToastContainer from '@/shared/components/toast-container.vue'
import { useSearchStore } from '@/stores/search'

const searchStore = useSearchStore()

function handleGlobalKeydown(event: KeyboardEvent) {
  const target = event.target
  const isEditableTarget =
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    (target instanceof HTMLElement && target.isContentEditable)

  if (isEditableTarget && !searchStore.isOpen) return

  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    searchStore.open()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
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
        <PersistentPlayer />
        <AppBottomNav />
      </div>
    </div>
    <GlobalSearchDialog />
    <ToastContainer />
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
}
</style>
