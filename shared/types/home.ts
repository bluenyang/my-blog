import type { PostItem, RawPostItem } from './post';
import type { RawSeriesItem, SeriesItem } from './series';
import type { SidebarContent } from './sidebar';

export interface RawHomePosts {
  homePosts: RawPostItem[];
  homeSeries: RawSeriesItem[];
}

export interface HomePosts {
  recentPosts: PostItem[];
  popularSeries: SeriesItem[];
  sidebar?: SidebarContent;
}
