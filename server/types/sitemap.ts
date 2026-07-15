export interface SitemapPost {
  post_idx: number;
  slug: string;
}

export interface SitemapSlugItem {
  slug: string;
}

export interface SitemapUrlEntry {
  loc: string;
  _path: string;
}
