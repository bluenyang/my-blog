import { useQuery } from '#server/utils/use-query';
import { postMapper, postSearchMapper, sidebarMapper } from '~~/server/features/mapper';
import type { RawPosts, RawSidebarContent } from '~~/server/types/raw-data';
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

  // sidebar
  const needSidebar = query.sidebar === 'true';

  const directus = useDirectus();
  const { buildQuery, sidebar, posts, series, category, tag } = useQuery();

  try {
    const result = await directus.query<RawPosts & Partial<RawSidebarContent>>(
      buildQuery(
        posts(limit, offset, search, categorySlug, tagSlug, seriesSlug),
        seriesSlug ? series(seriesSlug) : undefined,
        categorySlug ? category(categorySlug) : undefined,
        tagSlug ? tag(tagSlug) : undefined,
        needSidebar ? sidebar : undefined,
      ),
    );

    const postsData = postMapper(result.posts);
    const metadata = (() => {
      if (searchType === 'category') {
        return postSearchMapper(result.category![0]!);
      } else if (searchType === 'tag') {
        return postSearchMapper(result.tag![0]!);
      } else if (searchType === 'series') {
        return postSearchMapper(result.series![0]!);
      } else {
        return undefined;
      }
    })();

    const payload: PostsResponse = {
      searchType,
      metadata,
      posts: postsData,
      sidebar: needSidebar ? sidebarMapper(result) : undefined,
    };

    return payload;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts',
    });
  }
});
