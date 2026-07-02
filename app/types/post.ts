import type { MDCParserResult } from '@nuxtjs/mdc';

export interface PostCategoryBridge {
  categories_id: {
    id?: string;
    name: string;
    slug?: string;
  };
}

export interface PostTagBridge {
  tags_id: {
    id?: string;
    name: string;
    slug?: string;
  };
}

export interface PostSeriesBridge {
  series_id: {
    id?: string;
    name: string;
    slug?: string;
  };
}

export interface PostM2MBridge {
  id?: string;
  name: string;
  slug?: string;
}

export interface RawPostAuthor {
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  avatar: string | null;
}

export interface RawPostItem {
  id: string;
  blog_id: string;
  author_id?: RawPostAuthor | null;
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
  categories: PostCategoryBridge[] | null;
  tags: PostTagBridge[] | null;
  series: PostSeriesBridge[] | null;
}

export interface PostAuthor {
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  avatar: string | null;
}

export interface PostItem {
  id: string;
  blogId: string;
  author?: PostAuthor;
  postIdx: number;
  title: string;
  slug: string;
  summary: string;
  content?: MDCParserResult | null;
  thumbnail: string | null;
  status: 'draft' | 'published' | 'archived';
  visibility: 'public' | 'private' | 'protected';
  passwordHash?: string;
  publishedAt: string | null;
  updatedAt: string;
  categories: PostM2MBridge[] | null;
  tags: PostM2MBridge[] | null;
  series: PostM2MBridge[] | null;
}
