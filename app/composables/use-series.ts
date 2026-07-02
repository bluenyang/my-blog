import type { SeriesItem, SeriesPostCountResponse, SeriesResponse } from '~/types/series';

export function useSeries() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<{ series: SeriesItem[]; total: number }>(
    'global-series',
    async (): Promise<{ series: SeriesItem[]; total: number }> => {
      // 시리즈 목록 조회 및 포스트 갯수 집계를 Promise.all로 병렬 처리
      const [seriesReq, countsReq] = await Promise.all([
        // Series 조회
        $fetch<{ data: SeriesResponse[] }>(`${config.public.directusUrl}/items/series`, {
          query: {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'name', 'slug', 'description', 'thumbnail'],
            sort: ['name'],
          },
        }),
        // 포스트 수 집계
        $fetch<{ data: SeriesPostCountResponse[] }>(
          `${config.public.directusUrl}/items/posts_series`,
          {
            query: {
              aggregate: { count: 'posts_id' },
              groupBy: ['series_id'],
              filter: {
                posts_id: {
                  blog_id: {
                    slug: { _eq: config.public.blogSlug },
                  },
                  status: { _eq: 'published' },
                },
              },
            },
          },
        ),
      ]);

      const rawSeries = seriesReq.data;
      const rawCounts = countsReq.data;

      const countMap = new Map<string, number>();
      let total = 0;

      rawCounts.forEach((item) => {
        if (item.series_id) {
          const count = Number(item.count.posts_id);
          countMap.set(item.series_id, count);
          total += count;
        }
      });

      const seriesWithCount: SeriesItem[] = rawSeries.map((series) => {
        return {
          id: series.id,
          blogId: series.blog_id,
          name: series.name,
          slug: series.slug,
          description: series.description,
          thumbnail: series.thumbnail,
          postCount: countMap.get(series.id) || 0,
        };
      });

      return { series: seriesWithCount, total };
    },
    {
      default: () => ({ series: [], total: 0 }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    series: computed<SeriesItem[]>(() => data.value?.series || []),
    total: computed<number>(() => data.value?.total || 0),
  };
}

export function useSeriesBySlug(slug: Ref<string | undefined> | string | undefined) {
  const config = useRuntimeConfig();
  const slugRef = computed(() => unref(slug));

  const { data, pending } = useAsyncData<{ series: SeriesItem | null }>(
    computed(() => `series-by-slug-${slugRef.value}`).value,
    async () => {
      if (!slugRef.value) return { series: null };

      const response = await $fetch<{ data: SeriesResponse[] }>(
        `${config.public.directusUrl}/items/series`,
        {
          query: {
            filter: {
              blog_id: { slug: { _eq: config.public.blogSlug } },
              slug: { _eq: slugRef.value },
            },
            fields: ['id', 'blog_id', 'name', 'slug', 'description', 'thumbnail'],
            limit: 1,
          },
        },
      );

      const [raw] = response.data;
      if (!raw) return { series: null };

      return {
        series: {
          id: raw.id,
          blogId: raw.blog_id,
          name: raw.name,
          slug: raw.slug,
          description: raw.description,
          thumbnail: raw.thumbnail,
        },
      };
    },
    {
      watch: [slugRef],
    },
  );

  return {
    series: computed<SeriesItem | null>(() => data.value?.series ?? null),
    pending,
  };
}
