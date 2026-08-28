import { searchMapper } from '~~/server/features/mapper';
import type { RawSearchPosts } from '~~/server/types/raw-data';
import type { SearchResponse } from '~~/shared/types';
import { decodeRouteSlug } from '~~/shared/utils/decode-route-slug';

/**
 * ⌘K 팔레트 전용 경량 검색.
 * /api/posts와 달리 총계 집계를 돌리지 않아, 키 입력마다 도는 쿼리 비용이 절반이다.
 */
export default defineCachedEventHandler(
  async (event): Promise<SearchResponse> => {
    const query = getQuery(event);
    const search = decodeRouteSlug(String(query.q ?? query.search ?? '')).trim();
    const limit = Math.min(Math.max(Math.trunc(Number(query.limit)) || 8, 1), 20);

    // 한 글자 검색은 결과가 너무 넓어 의미가 없다. 클라이언트에서도 같은 기준으로 막는다.
    if (search.length < 2) {
      return { query: search, posts: [] };
    }

    const directus = useDirectus();
    const { buildQuery, postSearch } = useQuery();

    try {
      const result = await directus.query<RawSearchPosts>(buildQuery(postSearch(search, limit)));
      return { query: search, posts: searchMapper(result) };
    } catch (error) {
      if (isError(error)) {
        throw error;
      }
      console.error('Failed to search posts:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to search posts',
      });
    }
  },
  {
    name: 'search',
    maxAge: 120,
    swr: true,
    getKey: (event) => {
      const query = getQuery(event);
      return `${String(query.q ?? query.search ?? '')}|${query.limit ?? 8}`;
    },
  },
);
