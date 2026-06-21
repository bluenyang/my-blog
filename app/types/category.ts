export interface CategoryItem {
  id: string;
  blogId: string;
  parentId: string;
  name: string;
  slug: string;
  icon?: string;
  postCount?: number;
  children?: CategoryItem[];
}

export interface CategoryListResponse {
  id: string;
  blog_id: string;
  parent_id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface CategoryPostCountResponse {
  category_id: string;
  count: string | number;
}
