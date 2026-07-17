import { getDirectusImageUrl } from '../utils/directus';

import type {
  RawSeriesItem,
  RawSeriesItemInPost,
  SeriesItem,
  SeriesItemInPost,
} from '~~/shared/types/series';

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
    name: item.name,
    postCount: Number(item.posts_func.count),
    posts: item.posts.map((post) => ({
      postIdx: post.post_idx,
      slug: post.slug,
      title: post.title,
    })),
  }));
}
