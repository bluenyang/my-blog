import { getDirectusImageUrl } from '../utils/directus';

import { categoryInPostMapper, seriesInPostMapper, tagInPostMapper } from './mapper';

import type {
  RawCategoryItem,
  RawPostDetail,
  RawPostItem,
  RawSeriesItem,
  RawTagItem,
} from '~~/server/types/raw-data';
import type { PostDetail, PostItem, PostSearch } from '~~/shared/types';

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
  if (raw.posts.length === 0) {
    throw new Error('No posts found');
  }

  const post = raw.posts[0]!;

  return {
    postIdx: post.post_idx,
    author: {
      firstName: post.author_id.first_name,
      lastName: post.author_id.last_name,
      avatar: post.author_id.avatar?.id ? getDirectusImageUrl(post.author_id.avatar.id) : null,
      nickname: post.author_id.nickname,
    },
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    thumbnail: post.thumbnail?.id ? getDirectusImageUrl(post.thumbnail.id) : null,
    content: post.content,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    categories: post.categories ? categoryInPostMapper(post.categories) : null,
    tags: post.tags ? tagInPostMapper(post.tags) : null,
    series: post.series ? seriesInPostMapper(post.series) : null,
  };
}

export function postSearchMapper(raw: RawCategoryItem | RawSeriesItem | RawTagItem): PostSearch {
  if ('description' in raw) {
    return {
      name: raw.name,
      slug: raw.slug,
      totalCount: raw.posts_func.count,
      description: raw.description ? raw.description : undefined,
      thumbnail: raw.thumbnail ? getDirectusImageUrl(raw.thumbnail.id) : undefined,
    };
  }
  return {
    name: raw.name,
    slug: raw.slug,
    totalCount: raw.posts_func.count,
  };
}
