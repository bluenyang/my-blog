export function buildTree<T extends { slug: string; parentId: string | null; children?: T[] }>(
  items: T[],
): T[] {
  const itemMap = new Map<string, T>();
  const rootItems: T[] = [];

  // children을 빈 배열로 초기화
  items.forEach((item) => {
    itemMap.set(item.slug, { ...item, children: [] });
  });

  // 트리 구성
  items.forEach((item) => {
    const mappedItem = itemMap.get(item.slug)!;
    if (item.parentId) {
      // parent_id 가 있다면 부모 항목을 찾아서 추가
      const parent = itemMap.get(item.parentId);
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
