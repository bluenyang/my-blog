import type { NavigationItem } from '~/types/header';

export function buildNavigationTree(items: NavigationItem[]): NavigationItem[] {
  const itemMap = new Map<string, NavigationItem>();
  const rootItems: NavigationItem[] = [];

  // children을 빈 배열로 초기화
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // 트리 구성
  items.forEach((item) => {
    const mappedItem = itemMap.get(item.id)!;
    if (item.parent_id) {
      // parent_id 가 있다면 부모 항목을 찾아서 추가
      const parent = itemMap.get(item.parent_id);
      if (parent) {
        parent.children?.push(mappedItem);
      }
    } else {
      // parent_id 가 없다면 최상위 항목
      rootItems.push(mappedItem);
    }
  });

  return rootItems;
}
