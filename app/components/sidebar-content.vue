<script setup lang="ts">
  import Categories from './sidebar/categories.vue';
  import SearchBar from './sidebar/search-bar.vue';
</script>

<template>
  <div class="divide-sidebar-border container flex w-full flex-col divide-y rounded-lg">
    <SidebarProfile />
    <SearchBar />
    <Categories />
  </div>
</template>
