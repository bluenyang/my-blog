import { postDetailMapper } from '~~/server/features/mapper';
import type { RawPostDetail } from '~~/server/types/raw-data';

export default defineEventHandler(async (event): Promise<PostDetail> => {
  const postIdx = Number(getRouterParam(event, 'idx'));

  const directus = useDirectus();
  const { buildQuery, postDetail } = useQuery();

  if (!Number.isInteger(postIdx) || postIdx < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid post index',
    });
  }

  try {
    const result = await directus.query<RawPostDetail>(buildQuery(postDetail(postIdx)));

    // 없는 글은 404여야 한다. 매퍼가 던지는 일반 Error는 아래 catch가 500으로 삼킨다.
    if (!result.posts?.length) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Post not found',
      });
    }

    return postDetailMapper(result);
  } catch (error) {
    // 위에서 만든 404 같은 H3 에러는 그대로 통과시킨다
    if (isError(error)) {
      throw error;
    }
    console.error('Failed to fetch post detail:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch post detail',
    });
  }
});
