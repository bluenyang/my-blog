import { sitemapMapper } from '~~/server/features/mapper';
import type { RawSitemapItems, SitemapPost, SitemapUrlEntry } from '~~/server/types/sitemap';

function toEntry(path: string): SitemapUrlEntry {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return { loc: normalized, _path: normalized };
}

function postToEntry(post: SitemapPost): SitemapUrlEntry {
  return toEntry(`/posts/${post.postIdx}-${post.slug}`);
}

export default defineEventHandler(async (): Promise<SitemapUrlEntry[]> => {
  const directus = useDirectus();
  const { sitemap, buildQuery } = useQuery();

  try {
    const resp = await directus.query<RawSitemapItems>(buildQuery(sitemap));

    const sitemapItems = sitemapMapper(resp);

    const postUrls = sitemapItems.posts.map(postToEntry);
    const categoryUrls = sitemapItems.categories.map((item) => toEntry(`/categories/${item.slug}`));
    const tagUrls = sitemapItems.tags.map((item) => toEntry(`/tags/${item.slug}`));
    const seriesUrls = sitemapItems.series.map((item) => toEntry(`/series/${item.slug}`));

    return [...postUrls, ...categoryUrls, ...tagUrls, ...seriesUrls];
  } catch (error) {
    console.error('Failed to fetch sitemap URLs:', error);
    return [];
  }
});
