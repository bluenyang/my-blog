import { postMapper, seriesMapper } from './mapper';

import type { RawHomePosts } from '~~/server/types/raw-data';
import type { HomePosts } from '~~/shared/types/home';

export function homeMapper(raw: RawHomePosts): HomePosts {
  return {
    recentPosts: postMapper(raw.homePosts),
    popularSeries: seriesMapper(raw.homeSeries),
  };
}
