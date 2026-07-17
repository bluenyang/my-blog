import type { CategoryItemInPost, RawCategoryItemInPost } from './category';
import type { RawSeriesItemInPost, SeriesItemInPost } from './series';
import type { SidebarContent } from './sidebar';
import type { RawTagItemInPost, TagItemInPost } from './tag';

export interface RawPostAuthor {
  first_name: string | null;
  last_name: string | null;
  avatar: {
    id: string;
  } | null;
  nickname: string | null;
}

export interface PostAuthor {
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  nickname: string | null;
}

export interface RawPostItem {
  author_id: RawPostAuthor;
  post_idx: number;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: {
    id: string;
  };
  published_at: string;
  updated_at: string;
  categories: {
    categories_id: {
      name: string;
      slug: string;
    };
  }[];
  tags: {
    tags_id: {
      name: string;
      slug: string;
    };
  }[];
  series: {
    series_id: {
      name: string;
      slug: string;
    };
  }[];
}

export interface PostItem {
  postIdx: number;
  author: PostAuthor;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  publishedAt: string;
  updatedAt: string;
  categories: string[] | null;
  tags: string[] | null;
  series: string[] | null;
}

export interface RawPostDetail {
  posts: {
    author_id: RawPostAuthor;
    post_idx: number;
    title: string;
    slug: string;
    summary: string | null;
    thumbnail: {
      id: string;
    } | null;
    content: string;
    published_at: string;
    updated_at: string;
    categories: RawCategoryItemInPost[] | null;
    tags: RawTagItemInPost[] | null;
    series: RawSeriesItemInPost[] | null;
  }[];
}

export interface PostDetail {
  postIdx: number;
  author: PostAuthor;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  content: string;
  publishedAt: string;
  updatedAt: string;
  categories: CategoryItemInPost[] | null;
  tags: TagItemInPost[] | null;
  series: SeriesItemInPost[] | null;
  sidebar?: SidebarContent;
}
