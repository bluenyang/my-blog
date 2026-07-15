/**
 * Directus Flow에서 호출하는 재배포 엔드포인트.
 *
 * - URL: POST {blogs.base_url}/api/rebuild
 * - Header: x-rebuild-token: <REBUILD_SECRET>
 *   (또는 Authorization: Bearer <REBUILD_SECRET>)
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const headerToken = getHeader(event, 'x-rebuild-token');
  const authHeader = getHeader(event, 'authorization');
  const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  const token = headerToken || bearerToken;

  if (!config.rebuildSecret || !token || token !== config.rebuildSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  if (!config.netlifyBuildHookUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NETLIFY_BUILD_HOOK_URL is not configured',
    });
  }

  await $fetch(config.netlifyBuildHookUrl, {
    method: 'POST',
  });

  return { ok: true };
});
