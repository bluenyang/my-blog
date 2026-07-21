import { postMapper, postSearchMapper } from '~~/server/features/mapper';
import type { RawCategoryTree, RawPosts } from '~~/server/types/raw-data';
import type { PostsResponse } from '~~/shared/types';
import { decodeRouteSlug } from '~~/shared/utils/decode-route-slug';

export default defineEventHandler(async (event): Promise<PostsResponse> => {
  const query = getQuery(event);

  // pagination
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const offset = (page - 1) * limit;

  // search
  const search = query.search ? decodeRouteSlug(String(query.search)) : undefined;
  const categorySlug = query.category ? decodeRouteSlug(String(query.category)) : undefined;
  const tagSlug = query.tag ? decodeRouteSlug(String(query.tag)) : undefined;
  const seriesSlug = query.series ? decodeRouteSlug(String(query.series)) : undefined;

  const searchType: 'search' | 'category' | 'tag' | 'series' | null = (() => {
    if (search) {
      return 'search';
    } else if (categorySlug && !seriesSlug && !tagSlug) {
      return 'category';
    } else if (tagSlug && !seriesSlug && !categorySlug) {
      return 'tag';
    } else if (seriesSlug && !categorySlug && !tagSlug) {
      return 'series';
    } else if (!search && !categorySlug && !tagSlug && !seriesSlug) {
      return null;
    } else {
      return 'search';
    }
  })();

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
});

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
