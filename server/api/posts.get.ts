import { useQuery } from '#server/utils/use-query';
import { postsMapper, sidebarMapper } from '~~/server/features/mapper';
import type { PostsResponse, RawPosts } from '~~/shared/types/post';
import type { RawSidebarContent } from '~~/shared/types/sidebar';

export default defineEventHandler(async (event): Promise<PostsResponse> => {
  const limit = Number(getQuery(event).limit) || 10;
  const page = Number(getQuery(event).page) || 1;
  const offset = (page - 1) * limit;
  const needSidebar = getQuery(event).sidebar === 'true';

  const directus = useDirectus();
  const { buildQuery, sidebar, posts } = useQuery();

  try {
    const result = await directus.query<RawPosts & Partial<RawSidebarContent>>(
      buildQuery(posts(limit, offset), needSidebar ? sidebar : undefined),
    );

    // return result;

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
