export type SearchType = 'search' | 'category' | 'tag' | 'series' | null;

export interface SearchTypeInput {
  search?: string;
  category?: string;
  tag?: string;
  series?: string;
}

/**
 * 목록이 어떤 종류의 필터를 보고 있는지 판정한다.
 *
 * 서버(/api/posts)와 클라이언트(filtered-posts-view)가 **각자** 호출한다.
 * 클라이언트가 서버 응답의 searchType을 기다리면 헤더가 한 박자 늦게 바뀌므로
 * 평가는 양쪽에서 따로 하되, 규칙만 이 함수로 공유해 서로 어긋나지 않게 한다.
 */
export function resolveSearchType({ search, category, tag, series }: SearchTypeInput): SearchType {
  if (search) return 'search';
  if (category && !series && !tag) return 'category';
  if (tag && !series && !category) return 'tag';
  if (series && !category && !tag) return 'series';
  if (!search && !category && !tag && !series) return null;
  // 두 개 이상이 겹치면 일반 검색으로 취급한다
  return 'search';
}
