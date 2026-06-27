export interface TagItem {
  id: string;
  blogId: string;
  name: string;
  slug: string;
  postCount?: number;
}

export interface TagListResponse {
  id: string;
  blog_id: string;
  name: string;
  slug: string;
}

export interface TagPostCountResponse {
  tags_id: string;
  count: {
    posts_id: string;
  };
}
