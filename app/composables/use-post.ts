export function usePostDetail(postIdx: number | string) {
  const { needSidebar, setSidebarData } = useSidebar();

  const { data, pending, error } = useFetch<PostDetail>(`/api/post/${postIdx}`, {
    method: 'GET',
    query: computed(() => ({
      sidebar: needSidebar.value,
    })),
  });

  watchEffect(() => {
    if (data.value?.sidebar) {
      setSidebarData(data.value.sidebar);
    }
  });

  return {
    post: computed(() => data.value || undefined),
    pending,
    error,
  };
}
