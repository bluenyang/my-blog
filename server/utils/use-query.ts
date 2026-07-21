import {
  categoryQuery,
  categoryTreeQuery,
  homeQuery,
  postDetailQuery,
  postsQuery,
  rssQuery,
  seriesQuery,
  sidebarQuery,
  sitemapQuery,
  tagQuery,
} from '~~/server/features/query';

export function useQuery() {
  const config = useRuntimeConfig();

  function buildQuery(...queries: (string | undefined)[]) {
    const query = queries.filter(Boolean).join('\n');
    return `query {\n  ${query}\n}`;
  }

  return {
    buildQuery,
    sidebar: sidebarQuery(config.public.blogSlug),
    home: homeQuery(config.public.blogSlug),
    postDetail: (postIdx: number) => postDetailQuery(config.public.blogSlug, postIdx),
    posts: (
      limit: number,
      offset: number,
      search?: string,
      categories?: string[],
      tag?: string,
      series?: string,
    ) => postsQuery(config.public.blogSlug, limit, offset, search, categories, tag, series),
    series: (seriesSlug: string) => seriesQuery(config.public.blogSlug, seriesSlug),
    sitemap: sitemapQuery(config.public.blogSlug),
    rss: rssQuery(config.public.blogSlug),
    category: (categorySlug: string) => categoryQuery(config.public.blogSlug, categorySlug),
    categoryTree: categoryTreeQuery(config.public.blogSlug),
    tag: (tagSlug: string) => tagQuery(config.public.blogSlug, tagSlug),
  };
}
