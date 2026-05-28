<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

function dismiss() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push("/artists");
  }
}
</script>

<template>
  <div class="profile-shell">
    <div class="profile-shell__backdrop" aria-hidden="true" @click="dismiss" />
    <div class="profile-shell__panel">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-shell {
  @media (max-width: 767px) {
    position: fixed;
    inset: 0;
    z-index: 300;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 768px) {
    display: contents;
  }
}

.profile-shell__backdrop {
  @media (max-width: 767px) {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
  }

  @media (min-width: 768px) {
    display: none;
  }
}

.profile-shell__panel {
  @media (max-width: 767px) {
    position: relative;
    flex: 1;
    margin-top: auto;
    max-height: calc(100% - 48px);
    overflow-y: auto;
    background: var(--color-bg);
    border-radius: 12px 12px 0 0;
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  }

  @media (min-width: 768px) {
    display: contents;
  }
}
</style>
