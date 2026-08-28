export interface SitemapUrlEntry {
  loc: string;
  _path: string;
}

export interface RawSitemapPost {
  post_idx: number;
  slug: string;
}

export interface SitemapPost {
  postIdx: number;
  slug: string;
}

export interface SitemapSlugItem {
  slug: string;
}

/** 글 수 0인 항목을 걸러내기 위한 원시 형태 */
export interface RawSitemapSlugItem {
  slug: string;
  posts_func: { count: number };
}

export interface RawSitemapItems {
  posts: RawSitemapPost[];
  categories: RawSitemapSlugItem[];
  tags: RawSitemapSlugItem[];
  series: RawSitemapSlugItem[];
}

export interface SitemapItems {
  posts: SitemapPost[];
  categories: SitemapSlugItem[];
  tags: SitemapSlugItem[];
  series: SitemapSlugItem[];
}
