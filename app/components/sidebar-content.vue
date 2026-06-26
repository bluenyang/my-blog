<script setup lang="ts">
  import Categories from './sidebar/categories.vue';
  import Links from './sidebar/links.vue';
  import SearchBar from './sidebar/search-bar.vue';
</script>

<template>
  <div
    class="sidebar divide-sidebar-border scrollbar-thumb-sidebar-border container flex w-full scrollbar-thin scrollbar-track-transparent flex-col divide-y overflow-y-auto rounded-lg p-4 pt-7"
  >
    <SidebarProfile />
    <SearchBar />
    <Categories />
    <Links />
  </div>
</template>
