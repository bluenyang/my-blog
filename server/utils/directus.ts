import { createDirectus, graphql, rest } from '@directus/sdk';
import type { ImageQuery } from '~~/server/types/image';

export function createDirectusClient(url: string) {
  return createDirectus(url).with(rest()).with(graphql());
}

/** Nitro / server route용 Directus 클라이언트 */
export function useDirectus() {
  const config = useRuntimeConfig();
  const url = config.public.directusUrl;

  if (!url) {
    throw new Error('[directus] runtimeConfig.public.directusUrl is not set');
  }

  return createDirectusClient(url);
}

export function getDirectusImageUrl(id: string, query?: ImageQuery) {
  const config = useRuntimeConfig();
  const url = config.public.directusUrl;
  if (!url) {
    throw new Error('[directus] runtimeConfig.public.directusUrl is not set');
  }
  const queryString = query
    ? `?${new URLSearchParams(query as Record<string, string>).toString()}`
    : '';
  return `${url}/assets/${id}${queryString}`;
}

export type DirectusClient = ReturnType<typeof createDirectusClient>;
