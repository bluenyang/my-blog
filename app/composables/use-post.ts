export function usePostDetail(postIdx: number | string) {
  const requestFetch = useRequestFetch();
  const key = `post-${postIdx}`;

  const { data, pending, error } = useFetch<PostDetail>(`/api/post/${postIdx}`, {
    method: 'GET',
    key,
    $fetch: requestFetch as typeof $fetch,
    getCachedData(cacheKey, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey];
      }
    },
  });

  return {
    post: computed(() => data.value ?? undefined),
    pending,
    error,
  };
}
