export interface RawCategoryItem {
  parent_id: {
    id: string;
  } | null;
  name: string;
  icon: string | null;
  slug: string;
  posts_func: {
    count: number;
  };
}

export interface CategoryItem {
  parentId: string | null;
  name: string;
  slug: string;
  icon: string | null;
  postCount?: number;
  children?: CategoryItem[];
}

export interface RawCategoryItemInPost {
  categories_id: {
    name: string;
    slug: string;
  };
}

export interface CategoryItemInPost {
  name: string;
  slug: string;
}
