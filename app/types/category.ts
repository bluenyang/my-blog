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

export interface RawCategoryItem {
  id: string;
  blog_id: string;
  parent_id: string;
  name: string;
  icon?: string;
  slug: string;
}

export interface RawCategoryPostCount {
  categories_id: string;
  count: {
    posts_id: string;
  };
}
