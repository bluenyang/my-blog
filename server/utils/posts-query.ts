import type { H3Event } from 'h3';

import { decodeRouteSlug } from '~~/shared/utils/decode-route-slug';

export interface ParsedPostsQuery {
  limit: number;
  page: number;
  offset: number;
  search?: string;
  categorySlug?: string;
  tagSlug?: string;
  seriesSlug?: string;
}

/**
 * /api/posts의 쿼리 파라미터를 클램프·디코드한다.
 *
 * 핸들러와 캐시 getKey가 **같은 함수**를 써야 한다. 원본 쿼리로 키를 만들면
 * ?limit=10과 ?limit=abc가 (둘 다 10으로 클램프되는데도) 서로 다른 캐시 키를 만들어
 * 같은 응답을 두 번 저장하게 된다.
 */
export function parsePostsQuery(event: H3Event): ParsedPostsQuery {
  const query = getQuery(event);

  // 상한/하한이 없으면 ?limit=100000이 그대로 Directus로 나가고 캐시 키도 무한정 늘어난다.
  // Math.trunc는 ?limit=2.5가 GraphQL Int 자리에 소수로 들어가는 것을 막는다.
  const limit = Math.min(Math.max(Math.trunc(Number(query.limit)) || 10, 1), 50);
  const page = Math.max(Math.trunc(Number(query.page)) || 1, 1);

  return {
    limit,
    page,
    offset: (page - 1) * limit,
    search: query.search ? decodeRouteSlug(String(query.search)) : undefined,
    categorySlug: query.category ? decodeRouteSlug(String(query.category)) : undefined,
    tagSlug: query.tag ? decodeRouteSlug(String(query.tag)) : undefined,
    seriesSlug: query.series ? decodeRouteSlug(String(query.series)) : undefined,
  };
}

/** 클램프·디코드된 값으로 캐시 키를 만든다. 키 생성은 반드시 이 함수를 거친다. */
export function postsCacheKey(event: H3Event): string {
  const q = parsePostsQuery(event);
  return [
    `l${q.limit}`,
    `p${q.page}`,
    q.search ? `s:${q.search}` : '',
    q.categorySlug ? `c:${q.categorySlug}` : '',
    q.tagSlug ? `t:${q.tagSlug}` : '',
    q.seriesSlug ? `se:${q.seriesSlug}` : '',
  ]
    .filter(Boolean)
    .join('|');
}
