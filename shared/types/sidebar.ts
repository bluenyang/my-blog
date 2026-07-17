import type { CategoryItem, RawCategoryItem } from './category';
import type { NavigationItem, RawNavigationItem } from './navigation';
import type { RawSeriesItem, SeriesItem } from './series';
import type { RawTagItem, TagItem } from './tag';

export interface RawSidebarContent {
  sidebarPostCount: {
    count: {
      id: number;
    };
  }[];
  sidebarCategories: RawCategoryItem[];
  sidebarSeries: RawSeriesItem[];
  sidebarTags: RawTagItem[];
  sidebarNavigations: RawNavigationItem[];
}

export interface SidebarContent {
  profile: {
    totalPosts: number;
  };
  categories: {
    total: number;
    items: CategoryItem[];
  };
  series: {
    items: SeriesItem[];
  };
  tags: {
    items: TagItem[];
  };
  navigations: {
    items: NavigationItem[];
  };
}
