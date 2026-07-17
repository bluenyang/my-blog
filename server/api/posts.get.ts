import { useQuery } from '#server/utils/use-query';
import { postsMapper, sidebarMapper } from '~~/server/features/mapper';
import type { PostsResponse, RawPosts } from '~~/shared/types/post';
import type { RawSidebarContent } from '~~/shared/types/sidebar';

export default defineEventHandler(async (event): Promise<unknown> => {
  const query = getQuery(event);

  // pagination
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const offset = (page - 1) * limit;

  // search
  const search = query.search ? String(query.search) : undefined;
  const category = query.category ? String(query.category) : undefined;
  const tag = query.tag ? String(query.tag) : undefined;
  const series = query.series ? String(query.series) : undefined;

  // sidebar
  const needSidebar = query.sidebar === 'true';

  const directus = useDirectus();
  const { buildQuery, sidebar, posts } = useQuery();

  try {
    const result = await directus.query<RawPosts & Partial<RawSidebarContent>>(
      buildQuery(
        posts(limit, offset, search, category, tag, series),
        needSidebar ? sidebar : undefined,
      ),
    );

    const postsData = postsMapper(result);
    const sidebarDetail = needSidebar ? sidebarMapper(result) : undefined;

    const payload: PostsResponse = { posts: postsData };
    if (needSidebar) {
      payload.sidebar = sidebarDetail;
    }

    return payload;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch posts',
    });
  }
});
