export interface PostCategoryBridge {
  categories_id?: {
    name: string;
    slug?: string;
  };
}

export interface PostTagBridge {
  tags_id?: {
    name: string;
    slug?: string;
  };
}

export interface PostSeriesBridge {
  series_id?: {
    name: string;
    slug?: string;
  };
}

export interface PostListResponse {
  id: string;
  blog_id: string;
  author_id: string;
  post_idx: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  thumbnail: string | null; // Directus Image UUID
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'protected';
  password_hash?: string;
  published_at: string | null;
  updated_at: string;
  categories?: PostCategoryBridge[];
  tags?: PostTagBridge[];
  series?: PostSeriesBridge[];
}

export interface PostItem {
  id: string;
  blogId: string;
  authorId: string;
  postIdx: number;
  title: string;
  slug: string;
  summary: string;
  content?: string;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'protected';
  passwordHash?: string;
  publishedAt: string | null;
  updatedAt: string;
  categories?: PostCategoryBridge[];
  tags?: PostTagBridge[];
  series?: PostSeriesBridge[];
}
