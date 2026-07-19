import { categoryMapper } from './category.mapper';
import { navigationMapper } from './navigation.mapper';
import { seriesMapper } from './series.mapper';
import { tagMapper } from './tag.mapper';

import type { RawSidebarContent } from '~~/server/types/raw-data';
import type { SidebarContent } from '~~/shared/types';

export function sidebarMapper(raw: RawSidebarContent): SidebarContent {
  const [sidebarPostCount] = raw.sidebarPostCount;

  const blogSettings = raw.blogSettings?.[0];

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
    blogSettings: blogSettings
      ? {
          allowCCL: blogSettings.allow_ccl,
          allowCommercial: blogSettings.allow_commercial,
          changeContent: blogSettings.change_content,
        }
      : undefined,
  };
}
