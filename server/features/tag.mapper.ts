import type { RawTagItem, RawTagItemInPost } from '~~/server/types/raw-data';
import type { TagItem, TagItemInPost } from '~~/shared/types';

export function tagMapper(raw: RawTagItem[]): TagItem[] {
  return raw.map((item) => ({
    name: item.name,
    slug: item.slug,
    postCount: Number(item.posts_func.count),
  }));
}

export function tagInPostMapper(raw: RawTagItemInPost[]): TagItemInPost[] {
  return raw.map((item) => ({
    name: item.tags_id.name,
    slug: item.tags_id.slug,
  }));
}
