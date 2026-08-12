export function useHome() {
  const requestFetch = useRequestFetch();

  const { data, pending, error } = useFetch<HomePosts>('/api/home', {
    method: 'GET',
    key: 'home',
    $fetch: requestFetch as typeof $fetch,
    getCachedData(cacheKey, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey];
      }
    },
  });

  return {
    recentPosts: computed(() => data.value?.recentPosts || []),
    popularSeries: computed(() => data.value?.popularSeries || []),
    pending,
    error,
  };
}
