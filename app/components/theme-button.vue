<script setup lang="ts">
  const colorMode = useColorMode();
  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  };
</script>

<template>
  <ClientOnly>
    <button
      class="cursor-pointer rounded-full p-2 transition-colors duration-200 hover:bg-white dark:hover:bg-white/20"
      aria-label="Toggle theme"
      @click="toggleColorMode"
    >
      <span class="flex items-center justify-center">
        <Icon v-if="colorMode.value === 'dark'" name="lucide:moon" class="size-5" />
        <Icon v-else name="lucide:sun" class="size-5" />
      </span>
    </button>
  </ClientOnly>
</template>
