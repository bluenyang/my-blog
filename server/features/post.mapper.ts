import type { ImageQuery } from '../types/image';
import { getDirectusImageUrl } from '../utils/directus';

import { categoryInPostMapper, seriesInPostMapper, tagInPostMapper } from './mapper';

import type {
  RawCategoryItem,
  RawPostDetail,
  RawPostItem,
  RawPostLink,
  RawSearchPosts,
  RawSeriesItem,
  RawTagItem,
} from '~~/server/types/raw-data';
import type { PostDetail, PostItem, PostLink, PostSearch, SearchPostHit } from '~~/shared/types';

export function postMapper(raw: RawPostItem[]): PostItem[] {
  return raw.map<PostItem>((item) => ({
    postIdx: item.post_idx,
    author: {
      firstName: item.author_id.first_name,
      lastName: item.author_id.last_name,
      avatar: item.author_id.avatar?.id
        ? getDirectusImageUrl(item.author_id.avatar.id, avatarImageQuery)
        : null,
      nickname: item.author_id.nickname,
    },
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    thumbnail: item.thumbnail?.id
      ? getDirectusImageUrl(item.thumbnail.id, cardThumbnailQuery)
      : null,
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
      avatar: post.author_id.avatar?.id
        ? getDirectusImageUrl(post.author_id.avatar.id, avatarImageQuery)
        : null,
      nickname: post.author_id.nickname,
    },
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    thumbnail: post.thumbnail?.id ? getDirectusImageUrl(post.thumbnail.id, coverImageQuery) : null,
    content: post.content,
    publishedAt: post.published_at,
    updatedAt: post.updated_at,
    categories: post.categories ? categoryInPostMapper(post.categories) : null,
    tags: post.tags ? tagInPostMapper(post.tags) : null,
    series: post.series ? seriesInPostMapper(post.series) : null,
    prev: postLinkMapper(raw.prevPost),
    next: postLinkMapper(raw.nextPost),
  };
}

/** 이전/다음 글은 limit 1로 가져오므로 배열의 첫 항목만 쓴다 */
function postLinkMapper(raw: RawPostLink[] | undefined): PostLink | null {
  const item = raw?.[0];
  if (!item) return null;
  return { postIdx: item.post_idx, title: item.title, slug: item.slug };
}

export function postSearchMapper(raw: RawCategoryItem | RawSeriesItem | RawTagItem): PostSearch {
  if ('description' in raw) {
    return {
      name: raw.name,
      slug: raw.slug,
      totalCount: raw.posts_func.count,
      description: raw.description ? raw.description : undefined,
      thumbnail: raw.thumbnail
        ? getDirectusImageUrl(raw.thumbnail.id, bannerImageQuery)
        : undefined,
    };
  }
  return {
    name: raw.name,
    slug: raw.slug,
    totalCount: raw.posts_func.count,
  };
}

/*
 * 목록 카드 썸네일. 소비자가 전부 object-cover라 width만 지정해 종횡비를 보존한다.
 * (실측: 원본 160KB/203KB -> 8.3KB/7.2KB, 94~96% 감소)
 */
const cardThumbnailQuery: ImageQuery = {
  width: 960,
  format: 'webp',
  quality: 75,
};

/** 글 상세 커버. 이 URL이 og:image로도 재사용되므로 OG 권장 폭에 맞춘다. */
const coverImageQuery: ImageQuery = {
  width: 1280,
  format: 'webp',
  quality: 80,
};

/** 시리즈·카테고리 상단 배너 */
const bannerImageQuery: ImageQuery = {
  width: 1200,
  format: 'webp',
  quality: 75,
};

/** size-12(48px) @2x 기준 — Directus 아바타 transform */
const avatarImageQuery: ImageQuery = {
  width: 96,
  height: 96,
  format: 'webp',
  quality: 80,
  fit: 'cover',
};

/** 팔레트 행의 썸네일 — 68px @2x */
const searchThumbnailQuery: ImageQuery = {
  width: 136,
  height: 136,
  format: 'webp',
  quality: 70,
  fit: 'cover',
};

export function searchMapper(raw: RawSearchPosts): SearchPostHit[] {
  return (raw.searchPosts ?? []).map((item) => ({
    postIdx: item.post_idx,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    thumbnail: item.thumbnail?.id
      ? getDirectusImageUrl(item.thumbnail.id, searchThumbnailQuery)
      : null,
    publishedAt: item.published_at,
    category: item.categories?.[0]?.categories_id.name ?? null,
  }));
}
