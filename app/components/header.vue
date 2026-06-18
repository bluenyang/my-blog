<script setup lang="ts">
  import { TransitionPresets } from '@vueuse/core';

  const { y } = useWindowScroll();
  const rawProgress = computed(() => {
    const progress = y.value / 160;
    return Math.max(0, Math.min(1, progress)); // 0과 1 사이로 값 고정 (Clamp)
  });

  const smoothProgress = useTransition(rawProgress, {
    duration: 400,
    transition: TransitionPresets.easeOutCubic,
  });

  // dock geometry (Scroll에 반응하는 동적 수치들)
  const marginTop = computed(() => smoothProgress.value * 12); // 0 -> 12
  const marginInline = computed(() => smoothProgress.value * 20); // 0 -> 20
  const borderRadius = computed(() => smoothProgress.value * 32); // 0 -> 22
  const paddingY = computed(() => 16 - smoothProgress.value * 4); // 16 -> 12
</script>

<template>
  <header
    v-motion="{
      initial: { opacity: 0, y: -20 },
      enter: { opacity: 1, y: 0, transition: { duration: 550, ease: 'easeOut' } },
    }"
    class="bg-header-bg fixed z-50 h-16 backdrop-blur-xl backdrop-brightness-104 backdrop-saturate-190"
    :style="{
      top: `${marginTop}px`,
      left: `${marginInline}px`,
      right: `${marginInline}px`,
      borderRadius: `${borderRadius}px`,
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
    }"
  ></header>
</template>
