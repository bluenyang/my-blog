export interface SeriesItem {
  id: string;
  blogId: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  postCount?: number;
}

export interface SeriesResponse {
  id: string;
  blog_id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string | null; // Directus Image UUID
}

export interface SeriesPostCountResponse {
  series_id: string;
  count: {
    posts_id: string;
  };
}
