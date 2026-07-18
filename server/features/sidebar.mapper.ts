import { categoryMapper } from './category.mapper';
import { navigationMapper } from './navigation.mapper';
import { seriesMapper } from './series.mapper';
import { tagMapper } from './tag.mapper';

import type { RawSidebarContent } from '~~/server/types/raw-data';
import type { SidebarContent } from '~~/shared/types';

export function sidebarMapper(raw: RawSidebarContent): SidebarContent {
  const [sidebarPostCount] = raw.sidebarPostCount;

  return {
    profile: {
      totalPosts: Number(sidebarPostCount!.count.id),
    },
    categories: {
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
