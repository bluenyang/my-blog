import { getDirectusImageUrl } from '../utils/directus';

import type { RawSeriesItem, RawSeriesItemInPost } from '~~/server/types/raw-data';
import type { SeriesItem, SeriesItemInPost } from '~~/shared/types';

export function seriesMapper(raw: RawSeriesItem[]): SeriesItem[] {
  return raw.map<SeriesItem>((item) => ({
    name: item.name,
    slug: item.slug,
    description: item.description,
    thumbnail: item.thumbnail?.id ? getDirectusImageUrl(item.thumbnail.id) : null,
    postCount: Number(item.posts_func.count),
  }));
}

export function seriesInPostMapper(raw: RawSeriesItemInPost[]): SeriesItemInPost[] {
  return raw.map<SeriesItemInPost>((item) => ({
    name: item.series_id.name,
    slug: item.series_id.slug,
    postCount: Number(item.series_id.posts_func.count),
    posts: item.series_id.posts.map((post) => ({
      postIdx: post.posts_id.post_idx,
      slug: post.posts_id.slug,
      title: post.posts_id.title,
    })),
  }));
}
