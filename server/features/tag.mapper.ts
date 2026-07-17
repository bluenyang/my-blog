import type { RawTagItem, TagItem } from '~~/shared/types/tag';

export function tagMapper(raw: RawTagItem[]): TagItem[] {
  return raw.map((item) => ({
    name: item.name,
    slug: item.slug,
    postCount: Number(item.posts_func.count),
  }));
}
