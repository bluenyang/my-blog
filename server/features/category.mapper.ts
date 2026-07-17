import type { CategoryItem, RawCategoryItem } from '~~/shared/types/category';
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
