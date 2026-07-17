import { categoryMapper } from './category.mapper';
import { navigationMapper } from './navigation.mapper';
import { seriesMapper } from './series.mapper';
import { tagMapper } from './tag.mapper';

import type { RawSidebarContent } from '~~/server/types/raw-data/sidebar';
import type { SidebarContent } from '~~/shared/types/sidebar';

export function sidebarMapper(raw: Partial<RawSidebarContent>): SidebarContent | undefined {
  if (
    !raw.sidebarPostCount ||
    !raw.sidebarCategories ||
    !raw.sidebarSeries ||
    !raw.sidebarTags ||
    !raw.sidebarNavigations
  ) {
    return undefined;
  }

  const [sidebarPostCount] = raw.sidebarPostCount;

  return {
    profile: {
      totalPosts: Number(sidebarPostCount!.count.id),
    },
    categories: {
      total: raw.sidebarCategories.length,
      items: categoryMapper(raw.sidebarCategories),
    },
    series: {
      items: seriesMapper(raw.sidebarSeries),
    },
    tags: {
      items: tagMapper(raw.sidebarTags),
    },
    navigations: {
      items: navigationMapper(raw.sidebarNavigations),
    },
  };
}
