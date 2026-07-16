import { readItems } from '@directus/sdk';

import type { SitemapSlugItem, SitemapUrlEntry } from '../types/sitemap';
import { fetchPublishedPostPaths } from '../utils/content-routes';

function toEntry(path: string): SitemapUrlEntry {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return { loc: normalized, _path: normalized };
}

export default defineEventHandler(async (): Promise<SitemapUrlEntry[]> => {
  const config = useRuntimeConfig();
  const directus = useDirectus();
  const blogSlug = config.public.blogSlug;
  const directusUrl = config.public.directusUrl;

  try {
    const [postPaths, categories, tags, series] = await Promise.all([
      fetchPublishedPostPaths(directusUrl, blogSlug),
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

    const postUrls = postPaths.map(toEntry);
    const categoryUrls = (categories || []).map((item) => toEntry(`/categories/${item.slug}`));
    const tagUrls = (tags || []).map((item) => toEntry(`/tags/${item.slug}`));
    const seriesUrls = (series || []).map((item) => toEntry(`/series/${item.slug}`));

    return [...postUrls, ...categoryUrls, ...tagUrls, ...seriesUrls];
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error);
    return [];
  }
});
