<script setup lang="ts">
  const route = useRoute();

  // 예전 /search?category|tag|series= 링크 호환
  watch(
    () => route.query,
    (query) => {
      if (typeof query.category === 'string' && query.category) {
        navigateTo(`/categories/${query.category}`, { replace: true });
        return;
      }
      if (typeof query.tag === 'string' && query.tag) {
        navigateTo(`/tags/${query.tag}`, { replace: true });
        return;
      }
      if (typeof query.series === 'string' && query.series) {
        navigateTo(`/series/${query.series}`, { replace: true });
      }
    },
    { immediate: true },
  );

  const searchValue = computed(() => String(route.query.search || ''));
</script>

<template>
  <FilteredPostsView filter-type="search" :filter-value="searchValue" />
</template>
