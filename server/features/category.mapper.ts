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
    // 자식 글 수를 "더한다". 대입하면 부모가 직접 가진 글이 통째로 사라진다.
    // /api/posts는 collectCategorySlugs(자기 자신 포함)로 집계하므로 여기도 자기 자신을 포함해야
    // 사이드바 숫자와 카테고리 페이지 헤더가 일치한다.
    // 다만 한 글이 부모와 자식 카테고리에 동시에 속하면 여기서는 두 번 세어져 집계보다 커진다 —
    // 정확한 중복 제거는 집계 쿼리에서만 가능하다.
    payload.postCount =
      (item.postCount ?? 0) +
      payload.children.reduce((acc, child) => acc + (child.postCount ?? 0), 0);
  }

  return payload;
}
