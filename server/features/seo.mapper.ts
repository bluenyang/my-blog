import type { RawRssPosts, RssPost } from '../types/rss';

import type {
  RawSitemapItems,
  RawSitemapSlugItem,
  SitemapItems,
  SitemapSlugItem,
} from '~~/server/types/sitemap';

/*
 * 글이 0건인 카테고리/태그/시리즈는 사이트맵에서 뻐다.
 * 빈 목록 페이지를 신고하면 thin content로 취급된다.
 */
function withPosts(items: RawSitemapSlugItem[]): SitemapSlugItem[] {
  return items
    .filter((item) => Number(item.posts_func?.count ?? 0) > 0)
    .map(({ slug }) => ({ slug }));
}

export function sitemapMapper(raw: RawSitemapItems): SitemapItems {
  return {
    posts: raw.posts.map((post) => ({
      postIdx: post.post_idx,
      slug: post.slug,
    })),
    categories: withPosts(raw.categories),
    tags: withPosts(raw.tags),
    series: withPosts(raw.series),
  };
}

export function rssMapper(raw: RawRssPosts): RssPost[] {
  return raw.posts.map((post) => ({
    author: post.author_id.nickname ?? `${post.author_id.first_name} ${post.author_id.last_name}`,
    id: post.id,
    postIdx: post.post_idx,
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    publishedAt: new Date(post.published_at),
  }));
}
