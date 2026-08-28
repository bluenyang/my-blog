/**
 * 글 상세.
 *
 * async인 것이 중요하다 — 호출부가 await해야 SSR setup 안에서 error/post를 바로 읽을 수 있다.
 * await하지 않으면 Nuxt가 렌더 직전(onServerPrefetch)에야 해소하므로,
 * setup에서 상태 코드를 검사하는 코드가 항상 빈 값을 보게 된다.
 */
export async function usePostDetail(postIdx: number | string) {
  const requestFetch = useRequestFetch();
  const key = `post-${postIdx}`;

  const { data, pending, error } = await useFetch<PostDetail>(`/api/post/${postIdx}`, {
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
