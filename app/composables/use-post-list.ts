export function usePostList(
  limit: MaybeRefOrGetter<number>,
  page: MaybeRefOrGetter<number>,
  search?: MaybeRefOrGetter<string | undefined>,
  category?: MaybeRefOrGetter<string | undefined>,
  tag?: MaybeRefOrGetter<string | undefined>,
  series?: MaybeRefOrGetter<string | undefined>,
) {
  const { data, pending, error } = useFetch<PostsResponse>('/api/posts', {
    method: 'GET',
    query: computed(() => ({
      limit: toValue(limit),
      page: toValue(page),
      search: toValue(search) || undefined,
      category: toValue(category) || undefined,
      tag: toValue(tag) || undefined,
      series: toValue(series) || undefined,
    })),
  });

  return {
    posts: computed(() => data.value?.posts || []),
    metadata: computed(() => data.value?.metadata || undefined),
    totalCount: computed(() => data.value?.totalCount ?? 0),
    searchType: computed(() => data.value?.searchType || null),
    pending,
    error,
  };
}
