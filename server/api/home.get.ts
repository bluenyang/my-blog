import { homeMapper, sidebarMapper } from '~~/server/features/mapper';
import type { RawHomePosts, RawSidebarContent } from '~~/server/types/raw-data';
import type { HomePosts } from '~~/shared/types';

export default defineEventHandler(async (event): Promise<HomePosts> => {
  const needSidebar = getQuery(event).sidebar === 'true';

  const directus = useDirectus();
  const { buildQuery, sidebar, home } = useQuery();

  try {
    const result = await directus.query<RawHomePosts & Partial<RawSidebarContent>>(
      buildQuery(home, needSidebar ? sidebar : undefined),
    );

    const homeDetail = homeMapper(result);
    const sidebarDetail = needSidebar ? sidebarMapper(result) : undefined;

    const payload = homeDetail;
    if (needSidebar) {
      payload.sidebar = sidebarDetail;
    }

    return payload;
  } catch (error) {
    console.error('Failed to fetch home:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch home',
    });
  }
});
