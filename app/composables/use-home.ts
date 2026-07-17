export function useHome() {
  const { needSidebar, setSidebarData } = useSidebar();

  const { data, pending, error } = useFetch<HomePosts>('/api/home', {
    method: 'GET',
    query: {
      sidebar: needSidebar.value,
    },
  });

  watchEffect(() => {
    if (data.value?.sidebar) {
      setSidebarData(data.value.sidebar);
    }
  });

  return {
    recentPosts: computed(() => data.value?.recentPosts || []),
    popularSeries: computed(() => data.value?.popularSeries || []),
    pending,
    error,
  };
}
