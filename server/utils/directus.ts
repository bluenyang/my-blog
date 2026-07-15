import { createDirectusClient } from '#shared/directus';

/** Nitro / server route용 Directus 클라이언트 */
export function useDirectus() {
  const config = useRuntimeConfig();
  const url = config.public.directusUrl;

  if (!url) {
    throw new Error('[directus] runtimeConfig.public.directusUrl is not set');
  }

  return createDirectusClient(url);
}
