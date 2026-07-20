import type { RawPostItem } from './post';
import type { RawSeriesItem } from './series';

export interface RawHomeSettings {
  hero_image: {
    id: string;
  } | null;
}

export interface RawHomePosts {
  homePosts: RawPostItem[];
  homeSeries: RawSeriesItem[];
  homeSettings: RawHomeSettings[];
}
