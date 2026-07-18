import type { RawCategoryItem, RawCategoryItemInPost } from '~~/server/types/raw-data/category';
import type { CategoryItem, CategoryItemInPost } from '~~/shared/types/category';
import { buildTree } from '~~/shared/utils/build-tree';

type CategoryItemWithId = Omit<CategoryItem, 'children'> & {
  id: string;
  children?: CategoryItemWithId[];
};

export function categoryMapper(raw: RawCategoryItem[]): CategoryItem[] {
  const items: CategoryItemWithId[] = raw.map<CategoryItemWithId>((item) => ({
    id: item.id,
    parentId: item.parent_id?.id || null,
    name: item.name,
    slug: item.slug,
    icon: item.icon,
    children: [],
    postCount: Number(item.posts_func.count),
  }));
  const builtTree = buildTree<CategoryItemWithId>(items);
  return builtTree.map((item) => calculatePostCount(item));
  // return builtTree;
}

export function categoryInPostMapper(raw: RawCategoryItemInPost[]): CategoryItemInPost[] {
  return raw.map((item) => ({
    name: item.categories_id.name,
    slug: item.categories_id.slug,
  }));
}

export function calculatePostCount(item: CategoryItemWithId): CategoryItem {
  const payload: CategoryItem = {
    parentId: item.parentId,
    name: item.name,
    slug: item.slug,
    icon: item.icon,
    postCount: item.postCount,
  };

  // 자식 카테고리가 있는 경우
  if (item.children && item.children.length > 0) {
    // 우선 자식 카테고리까지 재귀적으로 계산
    payload.children = item.children.map<CategoryItem>((child) => calculatePostCount(child));
    // 자식 카테고리의 게시물 수를 합산하여 부모 카테고리의 게시물 수로 설정
    payload.postCount = payload.children.reduce((acc, child) => acc + (child.postCount ?? 0), 0);
  }

  return payload;
}
