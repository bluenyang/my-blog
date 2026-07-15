import type { DirectusClient } from '#shared/directus';

/** Nuxt plugin(`$directus`)에 등록된 Directus 클라이언트 */
export function useDirectus(): DirectusClient {
  return useNuxtApp().$directus;
}
