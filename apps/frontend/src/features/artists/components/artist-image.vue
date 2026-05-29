<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Music, Radio } from "lucide-vue-next";

const props = defineProps<{
  src: string;
  alt: string;
  icon: "Music" | "Radio";
  size?: number;
}>();

const imgError = ref(false);

watch(
  () => props.src,
  () => {
    imgError.value = false;
  },
);

const iconComponent = computed(() => {
  if (props.icon === "Radio") return Radio;
  return Music;
});
</script>

<template>
  <img
    v-if="src && !imgError"
    :src="src"
    :alt="alt"
    loading="lazy"
    @error="imgError = true"
  />
  <div v-else class="placeholder">
    <component :is="iconComponent" stroke-width="1" :size="size ?? 18" />
  </div>
</template>

<style scoped lang="scss">
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-muted);
}
</style>
