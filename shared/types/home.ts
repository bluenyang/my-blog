import type { PostItem } from './post';
import type { SeriesItem } from './series';

export interface HomePosts {
  recentPosts: PostItem[];
  popularSeries: SeriesItem[];
}
