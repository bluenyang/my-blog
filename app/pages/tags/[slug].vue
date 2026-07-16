<script setup lang="ts">
  const route = useRoute();
  const slug = computed(() => String(route.params.slug || ''));
</script>

<template>
  <FilteredPostsView filter-type="tag" :filter-value="slug" />
</template>
