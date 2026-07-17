import { postMapper, seriesMapper } from './mapper';

import type { HomePosts, RawHomePosts } from '~~/shared/types/home';

export function homeMapper(raw: RawHomePosts): HomePosts {
  return {
    recentPosts: postMapper(raw.homePosts),
    popularSeries: seriesMapper(raw.homeSeries),
  };
}
