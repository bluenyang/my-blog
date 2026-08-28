import type { RawTagItem, RawTagItemInPost } from '~~/server/types/raw-data';
import type { TagItem, TagItemInPost } from '~~/shared/types';

/** 사이드바와 /tags에 노출할 태그 수 */
const TAG_LIMIT = 20;

/*
 * 이전에는 쿼리가 created_at 순으로 20개를 잘랐다 — 가장 오래된 20개라
 * 대표성이 없었고 글이 많은 태그가 누락돼 있었다(전체 190개).
 * 집계는 서버에서 하고 응답에는 상위 20개만 실는다.
 */
export function tagMapper(raw: RawTagItem[]): TagItem[] {
  return raw
    .map((item) => ({
      name: item.name,
      slug: item.slug,
      postCount: Number(item.posts_func.count),
    }))
    .filter((tag) => tag.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount || a.name.localeCompare(b.name))
    .slice(0, TAG_LIMIT);
}

export function tagInPostMapper(raw: RawTagItemInPost[]): TagItemInPost[] {
  return raw.map((item) => ({
    name: item.tags_id.name,
    slug: item.tags_id.slug,
  }));
}
