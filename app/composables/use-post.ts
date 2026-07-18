export function usePostDetail(postIdx: number | string) {
  const { data, pending, error } = useFetch<PostDetail>(`/api/post/${postIdx}`, {
    method: 'GET',
    key: `post-${postIdx}`,
  });

  return {
    post: computed(() => data.value || undefined),
    pending,
    error,
  };
}
