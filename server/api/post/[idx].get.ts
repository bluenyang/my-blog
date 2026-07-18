import { postDetailMapper, sidebarMapper } from '~~/server/features/mapper';
import type { RawPostDetail, RawSidebarContent } from '~~/server/types/raw-data';

export default defineEventHandler(async (event): Promise<PostDetail> => {
  const postIdx = Number(getRouterParam(event, 'idx'));
  const needSidebar = getQuery(event).sidebar === 'true';

  const directus = useDirectus();
  const { buildQuery, sidebar, postDetail } = useQuery();

  if (isNaN(postIdx)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post index',
    });
  }

  try {
    const result = await directus.query<RawPostDetail & Partial<RawSidebarContent>>(
      buildQuery(postDetail(postIdx), needSidebar ? sidebar : undefined),
    );

    // return result;

    const postDetailData = postDetailMapper(result);
    const sidebarDetail = needSidebar ? sidebarMapper(result) : undefined;

    const payload = postDetailData;
    if (needSidebar) {
      payload.sidebar = sidebarDetail;
    }

    return payload;
  } catch (error) {
    console.error('Failed to fetch post detail:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post detail',
    });
  }
});
