<script setup lang="ts">
import PageHeader from "@/shared/components/page-header.vue";
</script>

<template>
  <section class="page">
    <PageHeader title="Home" />
    <p class="hint">Trending stations and genre explorer will appear here.</p>
  </section>
</template>

<style scoped lang="scss">
@use "@/shared/styles/page";

.hint {
  margin: 0;
  color: var(--color-muted);
  font-size: 13px;
}
</style>
