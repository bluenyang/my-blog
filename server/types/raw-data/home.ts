import type { RawPostItem } from './post';
import type { RawSeriesItem } from './series';

export interface RawHomePosts {
  homePosts: RawPostItem[];
  homeSeries: RawSeriesItem[];
}
