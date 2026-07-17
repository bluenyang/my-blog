import type { RawCategoryItem } from './category';
import type { RawNavigationItem } from './navigation';
import type { RawSeriesItem } from './series';
import type { RawTagItem } from './tag';

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
