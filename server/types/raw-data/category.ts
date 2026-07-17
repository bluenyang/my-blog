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

export interface RawCategoryItemInPost {
  categories_id: {
    name: string;
    slug: string;
  };
}
