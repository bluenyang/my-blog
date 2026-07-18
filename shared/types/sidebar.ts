import type { CategoryItem } from './category';
import type { NavigationItem } from './navigation';
import type { SeriesItem } from './series';
import type { TagItem } from './tag';

export interface SidebarContent {
  profile: {
    totalPosts: number;
  };
  categories: {
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
