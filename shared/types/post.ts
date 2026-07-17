import type { CategoryItemInPost } from './category';
import type { SeriesItemInPost } from './series';
import type { SidebarContent } from './sidebar';
import type { TagItemInPost } from './tag';

export interface PostAuthor {
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  nickname: string | null;
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

export interface PostsResponse {
  posts: PostItem[];
  sidebar?: SidebarContent;
}
