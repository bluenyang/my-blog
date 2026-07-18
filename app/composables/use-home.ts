export function useHome() {
  const { data, pending, error } = useFetch<HomePosts>('/api/home', {
    method: 'GET',
    key: 'home',
  });

  return {
    recentPosts: computed(() => data.value?.recentPosts || []),
    popularSeries: computed(() => data.value?.popularSeries || []),
    pending,
    error,
  };
}
