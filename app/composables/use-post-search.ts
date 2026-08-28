import type { SearchResponse } from '~~/shared/types';

/** 검색어 최소 길이 — 서버(/api/search)와 같은 기준이어야 헛된 요청이 나가지 않는다 */
export const SEARCH_MIN_LENGTH = 2;

/**
 * ⌘K 팔레트의 글 검색.
 *
 * immediate: false + server: false 조합이 핵심이다 — SSR에서는 돌지 않고,
 * 디바운스된 term이 바뀔 때만 발화한다.
 */
export function usePostSearch(term: Ref<string>) {
  const { data, pending } = useFetch<SearchResponse>('/api/search', {
    query: { q: term },
    key: 'search-palette',
    immediate: false,
    server: false,
    watch: [term],
  });

  return {
    results: computed(() =>
      term.value.length >= SEARCH_MIN_LENGTH ? (data.value?.posts ?? []) : [],
    ),
    pending,
  };
}
