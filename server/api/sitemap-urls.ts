import { readItems } from '@directus/sdk';

import type { SitemapPost, SitemapSlugItem, SitemapUrlEntry } from '../types/sitemap';

function toSearchUrl(queryKey: 'category' | 'tag' | 'series', slug: string): SitemapUrlEntry {
  const path = `search?${queryKey}=${encodeURIComponent(slug)}`;
  return { loc: path, _path: path };
}

export default defineEventHandler(async (): Promise<SitemapUrlEntry[]> => {
  const config = useRuntimeConfig();
  const directus = useDirectus();
  const blogSlug = config.public.blogSlug;

  try {
    const [posts, categories, tags, series] = await Promise.all([
      directus.request<SitemapPost[]>(
        readItems('posts', {
          filter: {
            blog_id: { slug: { _eq: blogSlug } },
            status: { _eq: 'published' },
          },
          fields: ['post_idx', 'slug'],
          limit: -1,
        }),
      ),
      directus.request<SitemapSlugItem[]>(
        readItems('categories', {
          filter: {
            blog_id: { slug: { _eq: blogSlug } },
          },
          fields: ['slug'],
          limit: -1,
        }),
      ),
      directus.request<SitemapSlugItem[]>(
        readItems('tags', {
          filter: {
            blog_id: { slug: { _eq: blogSlug } },
          },
          fields: ['slug'],
          limit: -1,
        }),
      ),
      directus.request<SitemapSlugItem[]>(
        readItems('series', {
          filter: {
            blog_id: { slug: { _eq: blogSlug } },
          },
          fields: ['slug'],
          limit: -1,
        }),
      ),
    ]);

    const postUrls: SitemapUrlEntry[] = (posts || []).map((post) => {
      const path = `posts/${post.post_idx}-${post.slug}`;
      return { loc: path, _path: path };
    });

    const categoryUrls = (categories || []).map((item) => toSearchUrl('category', item.slug));
    const tagUrls = (tags || []).map((item) => toSearchUrl('tag', item.slug));
    const seriesUrls = (series || []).map((item) => toSearchUrl('series', item.slug));

    return [...postUrls, ...categoryUrls, ...tagUrls, ...seriesUrls];
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error);
    return [];
  }
});
