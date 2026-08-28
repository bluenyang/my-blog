import { postMapper, postSearchMapper } from '~~/server/features/mapper';
import type { RawCategoryTree, RawPosts } from '~~/server/types/raw-data';
import type { PostsResponse } from '~~/shared/types';

import { resolveSearchType } from '~~/shared/utils/resolve-search-type';

import { parsePostsQuery, postsCacheKey } from '../utils/posts-query';

export default defineCachedEventHandler(
  async (event): Promise<PostsResponse> => {
    const { limit, offset, search, categorySlug, tagSlug, seriesSlug } = parsePostsQuery(event);

    const searchType = resolveSearchType({
      search,
      category: categorySlug,
      tag: tagSlug,
      series: seriesSlug,
    });

    const directus = useDirectus();
    const { buildQuery, posts, series, category, categoryTree, tag } = useQuery();

    try {
      const categorySlugs = categorySlug
        ? collectCategorySlugs(
            (await directus.query<RawCategoryTree>(buildQuery(categoryTree))).categories ?? [],
            categorySlug,
          )
        : undefined;

      const result = await directus.query<RawPosts>(
        buildQuery(
          posts(limit, offset, search, categorySlugs, tagSlug, seriesSlug),
          seriesSlug ? series(seriesSlug) : undefined,
          categorySlug ? category(categorySlug) : undefined,
          tagSlug ? tag(tagSlug) : undefined,
        ),
      );

      const postsData = postMapper(result.posts);
      const totalCount = Number(result.postsCount?.[0]?.count?.id ?? 0);

      const metadataSource =
        searchType === 'category'
          ? result.categories?.[0]
          : searchType === 'tag'
            ? result.tags?.[0]
            : searchType === 'series'
              ? result.series?.[0]
              : undefined;

      if (
        (searchType === 'category' || searchType === 'tag' || searchType === 'series') &&
        !metadataSource
      ) {
        throw createError({
          statusCode: 404,
          statusMessage: `${searchType} not found`,
        });
      }

      const metadata = metadataSource
        ? {
            ...postSearchMapper(metadataSource),
            // 상위 카테고리는 posts_func가 직접 연결만 세므로, 자손 포함 집계값으로 덮어씀
            ...(searchType === 'category' ? { totalCount } : {}),
          }
        : undefined;

      return {
        searchType,
        metadata,
        totalCount,
        posts: postsData,
      };
    } catch (error) {
      if (isError(error)) {
        throw error;
      }
      console.error('Failed to fetch posts:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch posts',
      });
    }
  },
  {
    name: 'posts',
    maxAge: 180,
    swr: true,
    // 핸들러와 동일한 클램프 결과로 키를 만든다 (posts-query.ts 주석 참고)
    getKey: postsCacheKey,
  },
);

function collectCategorySlugs(
  categories: RawCategoryTree['categories'],
  rootSlug: string,
): string[] {
  const childrenByParent = new Map<string, string[]>();

  for (const category of categories) {
    const parentSlug = category.parent_id?.slug;
    if (!parentSlug) {
      continue;
    }

    const children = childrenByParent.get(parentSlug) ?? [];
    children.push(category.slug);
    childrenByParent.set(parentSlug, children);
  }

  const slugs = new Set<string>();
  const pending = [rootSlug];

  while (pending.length > 0) {
    const slug = pending.pop()!;
    if (slugs.has(slug)) {
      continue;
    }

    slugs.add(slug);
    pending.push(...(childrenByParent.get(slug) ?? []));
  }

  return [...slugs];
}
