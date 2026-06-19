export interface CategoryItem {
  id: string;
  blog_id: string;
  parent_id: string;
  name: string;
  icon: string;
  slug: string;
  children?: CategoryItem[];
}
