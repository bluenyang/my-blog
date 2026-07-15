import { readItems } from '@directus/sdk';

import { createDirectusClient } from '../../shared/directus';
import type { SitemapPost } from '../types/sitemap';

/** 앱·sitemap·prerender에서 쓰는 글 상세 경로 */
export function toPostPath(postIdx: number, slug: string): string {
  return `/posts/${postIdx}-${slug}`;
}

/** 빌드/서버에서 published 글 상세 경로 목록 조회 */
export async function fetchPublishedPostPaths(
  directusUrl: string,
  blogSlug: string,
): Promise<string[]> {
  if (!directusUrl || !blogSlug) {
    return [];
  }

  const directus = createDirectusClient(directusUrl);
  const posts =
    (await directus.request<SitemapPost[]>(
      readItems('posts', {
        filter: {
          blog_id: { slug: { _eq: blogSlug } },
          status: { _eq: 'published' },
        },
        fields: ['post_idx', 'slug'],
        limit: -1,
      }),
    )) || [];

  return posts.map((post) => toPostPath(post.post_idx, post.slug));
}
