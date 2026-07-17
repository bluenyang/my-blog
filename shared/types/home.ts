import type { PostItem } from './post';
import type { SeriesItem } from './series';
import type { SidebarContent } from './sidebar';

export interface HomePosts {
  recentPosts: PostItem[];
  popularSeries: SeriesItem[];
  sidebar?: SidebarContent;
}
