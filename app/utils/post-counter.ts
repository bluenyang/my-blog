import type { CategoryItem } from '~/types/category';

export function accumulatePostCount(nodes: CategoryItem[]): number {
  let total = 0;

  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      accumulatePostCount(node.children);
      node.postCount! += node.children.reduce((acc, cur) => acc + cur.postCount!, 0);
    }
    total += node.postCount || 0;
  }
  return total;
}
