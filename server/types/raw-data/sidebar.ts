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
  blogSettings?: {
    allow_ccl: boolean;
    allow_commercial?: boolean;
    change_content?: 'allow' | 'share_alike' | 'no_derivative';
    license_note?: string;
  }[];
}
