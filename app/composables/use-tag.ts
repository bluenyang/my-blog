import { aggregate, readItems } from '@directus/sdk';

import type { TagItem, TagListResponse, TagPostCountResponse } from '~/types/tag';

export function useTag() {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { data } = useAsyncData<{ tags: TagItem[]; total: number }>(
    'global-tag',
    async (): Promise<{ tags: TagItem[]; total: number }> => {
      const [rawTags, rawCounts] = await Promise.all([
        directus.request<TagListResponse[]>(
          readItems('tags', {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'name', 'slug'],
            sort: ['name'],
          }),
        ),
        directus.request<TagPostCountResponse[]>(
          aggregate('posts_tags', {
            aggregate: { count: 'posts_id' },
            groupBy: ['tags_id'],
            query: {
              filter: {
                posts_id: {
                  blog_id: {
                    slug: { _eq: config.public.blogSlug },
                  },
                  status: { _eq: 'published' },
                },
              },
            },
          }),
        ),
      ]);

      const countMap = new Map<string, number>();
      let total = 0;

      (rawCounts || []).forEach((item) => {
        if (item.tags_id) {
          const count = Number(item.count.posts_id);
          countMap.set(item.tags_id, count);
          total += count;
        }
      });

      const tagsWithCount: TagItem[] = (rawTags || []).map((tag) => {
        return {
          id: tag.id,
          blogId: tag.blog_id,
          name: tag.name,
          slug: tag.slug,
          postCount: countMap.get(tag.id) || 0,
        };
      });

      return { tags: tagsWithCount, total };
    },
    {
      default: () => ({ tags: [], total: 0 }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    tags: computed<TagItem[]>(() => data.value?.tags || []),
    total: computed<number>(() => data.value?.total || 0),
  };
}
