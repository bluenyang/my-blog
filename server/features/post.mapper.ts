import { getDirectusImageUrl } from '../utils/directus';

import { seriesInPostMapper } from './mapper';

import type { PostDetail, PostItem, RawPostDetail, RawPostItem } from '~~/shared/types/post';

export function postMapper(raw: RawPostItem[]): PostItem[] {
  return raw.map<PostItem>((item) => ({
    postIdx: item.post_idx,
    author: {
      firstName: item.author_id.first_name,
      lastName: item.author_id.last_name,
      avatar: item.author_id.avatar?.id ? getDirectusImageUrl(item.author_id.avatar.id) : null,
      nickname: item.author_id.nickname,
    },
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    thumbnail: item.thumbnail?.id ? getDirectusImageUrl(item.thumbnail.id) : null,
    publishedAt: item.published_at,
    updatedAt: item.updated_at,
    categories: item.categories.map((category) => category.categories_id.name),
    tags: item.tags.map((tag) => tag.tags_id.name),
    series: item.series.map((series) => series.series_id.name),
  }));
}

export function postDetailMapper(raw: RawPostDetail): PostDetail {
  return {
    postIdx: raw.post_idx,
    author: {
      firstName: raw.author_id.first_name,
      lastName: raw.author_id.last_name,
      avatar: raw.author_id.avatar?.id ? getDirectusImageUrl(raw.author_id.avatar.id) : null,
      nickname: raw.author_id.nickname,
    },
    title: raw.title,
    slug: raw.slug,
    summary: raw.summary,
    thumbnail: raw.thumbnail?.id ? getDirectusImageUrl(raw.thumbnail.id) : null,
    content: raw.content,
    publishedAt: raw.published_at,
    updatedAt: raw.updated_at,
    categories:
      raw.categories?.map((category) => ({
        name: category.name,
        slug: category.slug,
      })) || null,
    tags:
      raw.tags?.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      })) || null,
    series: raw.series ? seriesInPostMapper(raw.series) : null,
  };
}
