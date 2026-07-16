<script setup lang="ts">
  const route = useRoute();
  const slug = computed(() => decodeRouteSlug(String(route.params.slug || '')));
</script>

<template>
  <div>
    <FilteredPostsView filter-type="tag" :filter-value="slug" />
  </div>
</template>
