<script setup lang="ts">
  import LinkItems from './link-items.vue';

  import type { NavigationItem } from '~~/shared/types';

  const { sidebar } = useSidebar();

  const linkItems = computed<NavigationItem[]>(() => {
    const items = sidebar.value?.navigations.items ?? [];
    const [link] = items.filter((item) => item.label === 'Links');
    if (link?.children) {
      return link.children;
    }
    return [];
  });
</script>

<template>
  <ul class="px-2 py-4">
    <LinkItems v-for="item in linkItems" :key="item.slug" :item="item" />
  </ul>
</template>
