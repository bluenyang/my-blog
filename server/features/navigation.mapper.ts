import type { RawNavigationItem } from '~~/server/types/raw-data';
import type { NavigationItem } from '~~/shared/types/navigation';
import { buildTree } from '~~/shared/utils/build-tree';

export function navigationMapper(raw: RawNavigationItem[]): NavigationItem[] {
  const items = raw.map<NavigationItem>((item) => ({
    label: item.label,
    slug: item.label,
    url: item.url,
    icon: item.icon,
    isCategory: item.is_category,
    parentId: item.parent_id?.id || null,
  }));
  return buildTree<NavigationItem>(items);
}
