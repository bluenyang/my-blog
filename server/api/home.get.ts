import { homeMapper } from '~~/server/features/mapper';
import type { RawHomePosts } from '~~/server/types/raw-data';
import type { HomePosts } from '~~/shared/types';

export default defineEventHandler(async (): Promise<HomePosts> => {
  const directus = useDirectus();
  const { buildQuery, home } = useQuery();

  try {
    const result = await directus.query<RawHomePosts>(buildQuery(home));
    return homeMapper(result);
  } catch (error) {
    console.error('Failed to fetch home:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch home',
    });
  }
});
