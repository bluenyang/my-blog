import { postDetailMapper } from '~~/server/features/mapper';
import type { RawPostDetail } from '~~/server/types/raw-data';

export default defineEventHandler(async (event): Promise<PostDetail> => {
  const postIdx = Number(getRouterParam(event, 'idx'));

  const directus = useDirectus();
  const { buildQuery, postDetail } = useQuery();

  if (isNaN(postIdx)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post index',
    });
  }

  try {
    const result = await directus.query<RawPostDetail>(buildQuery(postDetail(postIdx)));
    return postDetailMapper(result);
  } catch (error) {
    console.error('Failed to fetch post detail:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post detail',
    });
  }
});
