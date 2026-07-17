import type { RawCategoryItem, RawCategoryItemInPost } from '~~/server/types/raw-data/category';
import type { CategoryItem, CategoryItemInPost } from '~~/shared/types/category';
import { buildTree } from '~~/shared/utils/build-tree';

export function categoryMapper(raw: RawCategoryItem[]): CategoryItem[] {
  const items = raw.map((item) => ({
    parentId: item.parent_id?.id || null,
    name: item.name,
    slug: item.slug,
    icon: item.icon,
    postCount: Number(item.posts_func.count),
  }));
  return buildTree<CategoryItem>(items);
}

export function categoryInPostMapper(raw: RawCategoryItemInPost[]): CategoryItemInPost[] {
  return raw.map((item) => ({
    name: item.categories_id.name,
    slug: item.categories_id.slug,
  }));
}
