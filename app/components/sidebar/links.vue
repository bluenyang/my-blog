<script setup lang="ts">
  import LinkItems from './link-items.vue';

  import type { NavigationItem } from '~/types/header';

  const { menuItems } = useNavigationMenu();
  const linkItems = computed<NavigationItem[]>(() => {
    const [link] = menuItems.value.filter((item) => item.label === 'Links');
    if (link && link.children) {
      return link.children;
    }
    return [];
  });
</script>

<template>
  <ul class="px-2 py-4">
    <LinkItems v-for="item in linkItems" :key="item.id" :item="item" />
  </ul>
</template>
