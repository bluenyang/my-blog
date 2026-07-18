import { createDirectus, graphql, rest } from '@directus/sdk';

/** server utils에서 공유하는 Directus 클라이언트 팩토리 */
export function createDirectusClient(url: string) {
  return createDirectus(url).with(rest()).with(graphql());
}

export type DirectusClient = ReturnType<typeof createDirectusClient>;
