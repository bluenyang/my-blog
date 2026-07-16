import type { CategoryItem } from '~/types/category';

export function findCategoryBySlug(categories: CategoryItem[], slug: string): CategoryItem | null {
  for (const category of categories) {
    if (category.slug === slug) return category;
    if (category.children?.length) {
      const found = findCategoryBySlug(category.children, slug);
      if (found) return found;
    }
  }
  return null;
}
