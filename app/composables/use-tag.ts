import type { TagItem, TagListResponse, TagPostCountResponse } from '~/types/tag';

export function useTag() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<{ tags: TagItem[]; total: number }>(
    'global-tag',
    async (): Promise<{ tags: TagItem[]; total: number }> => {
      // 태그 목록 조회 및 포스트 갯수 집계를 Promise.all로 병렬 처리
      const [tagsReq, countsReq] = await Promise.all([
        // Tag 조회
        $fetch<{ data: TagListResponse[] }>(`${config.public.directusUrl}/items/tags`, {
          query: {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'name', 'slug'],
            sort: ['name'],
          },
        }),
        // 포스트 수 집계
        $fetch<{ data: TagPostCountResponse[] }>(`${config.public.directusUrl}/items/posts_tags`, {
          query: {
            aggregate: { count: 'posts_id' },
            groupBy: ['tags_id'],
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
      ]);

      const rawTags = tagsReq.data;
      const rawCounts = countsReq.data;

      const countMap = new Map<string, number>();
      let total = 0;

      rawCounts.forEach((item) => {
        if (item.tags_id) {
          const count = Number(item.count.posts_id);
          countMap.set(item.tags_id, count);
          total += count;
        }
      });

      const tagsWithCount: TagItem[] = rawTags.map((tag) => {
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
