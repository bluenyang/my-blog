import { getDirectusImageUrl } from '../utils/directus';

import { postMapper, seriesMapper } from './mapper';

import type { RawHomePosts } from '~~/server/types/raw-data';
import type { HomePosts } from '~~/shared/types/home';

export function homeMapper(raw: RawHomePosts): HomePosts {
  const [settings] = raw.homeSettings ?? [];

  return {
    recentPosts: postMapper(raw.homePosts),
    popularSeries: seriesMapper(raw.homeSeries),
    heroImage: settings?.hero_image?.id ? getDirectusImageUrl(settings.hero_image.id) : null,
  };
}
