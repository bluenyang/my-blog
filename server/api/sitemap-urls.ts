import { sitemapMapper } from '~~/server/features/mapper';
import type { RawSitemapItems, SitemapPost, SitemapUrlEntry } from '~~/server/types/sitemap';

function toEntry(path: string): SitemapUrlEntry {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return { loc: normalized, _path: normalized };
}

function postToEntry(post: SitemapPost): SitemapUrlEntry {
  return toEntry(`/posts/${post.postIdx}-${post.slug}`);
}

export default defineCachedEventHandler(
  async (): Promise<SitemapUrlEntry[]> => {
    const directus = useDirectus();
    const { sitemap, buildQuery } = useQuery();

    try {
      const resp = await directus.query<RawSitemapItems>(buildQuery(sitemap));

      const sitemapItems = sitemapMapper(resp);

      const postUrls = sitemapItems.posts.map(postToEntry);
      const categoryUrls = sitemapItems.categories.map((item) =>
        toEntry(`/categories/${item.slug}`),
      );
      const tagUrls = sitemapItems.tags.map((item) => toEntry(`/tags/${item.slug}`));
      const seriesUrls = sitemapItems.series.map((item) => toEntry(`/series/${item.slug}`));

      // 목록 인덱스 라우트도 사이트맵에 포함한다 (홈은 @nuxtjs/sitemap이 자동 추가)
      const indexUrls = ['/posts', '/tags', '/series', '/license'].map(toEntry);

      return [...indexUrls, ...postUrls, ...categoryUrls, ...tagUrls, ...seriesUrls];
    } catch (error) {
      console.error('Failed to fetch sitemap URLs:', error);
      return [];
    }
  },
  {
    name: 'sitemap-urls',
    maxAge: 3600,
    swr: true,
    getKey: () => 'sitemap-urls',
  },
);
