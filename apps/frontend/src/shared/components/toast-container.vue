<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-region" aria-live="polite" aria-label="Notifications">
      <article
        v-for="message in toastStore.messages"
        :key="message.id"
        class="toast"
        :class="`toast--${message.variant}`"
      >
        <div class="toast__copy">
          <p class="toast__title">{{ message.title }}</p>
          <p v-if="message.description" class="toast__description">
            {{ message.description }}
          </p>
        </div>
        <button
          type="button"
          class="toast__dismiss"
          aria-label="Dismiss notification"
          @click="toastStore.dismiss(message.id)"
        >
          <X stroke-width="1.5" :size="14" />
        </button>
      </article>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.toast-region {
  position: fixed;
  right: 16px;
  bottom: calc(var(--mobile-chrome-bottom, 120px) + 16px);
  z-index: 500;
  display: grid;
  width: min(360px, calc(100vw - 32px));
  gap: 8px;
  pointer-events: none;

  @media (min-width: 1024px) {
    bottom: calc(var(--desktop-chrome-bottom, 64px) + 16px);
  }
}

.toast {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 28px;
  gap: 10px;
  align-items: start;
  padding: 12px;
  border: 1px solid var(--minimal-border);
  border-radius: var(--radius-md);
  background: #ffffff;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.12);
  color: var(--minimal-ink);
  pointer-events: auto;
}

.toast--error {
  border-color: rgba(192, 57, 43, 0.28);
}

.toast__copy {
  min-width: 0;
}

.toast__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.toast__description {
  margin: 2px 0 0;
  color: var(--minimal-muted);
  font-size: 12px;
  line-height: 1.35;
}

.toast__dismiss {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--minimal-subtle);
  cursor: pointer;

  &:hover,
  &:focus-visible {
    background: var(--minimal-bg-selected);
    color: var(--minimal-ink);
  }
}
</style>
