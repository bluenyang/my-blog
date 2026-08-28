export interface RawSearchPost {
  post_idx: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: { id: string } | null;
  published_at: string;
  categories: { categories_id: { name: string; slug: string } }[] | null;
}

export interface RawSearchPosts {
  searchPosts: RawSearchPost[] | null;
}
