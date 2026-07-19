<script setup lang="ts">
  import LinkItems from './link-items.vue';

  const { sidebar } = useSidebar();
</script>

<template>
  <ul
    v-if="sidebar && sidebar.navigations.items && sidebar.navigations.items.length > 0"
    class="px-2 py-4"
  >
    <LinkItems v-for="item in sidebar.navigations.items" :key="item.id" :item="item" />
  </ul>
</template>
