import { aggregate, readItems } from '@directus/sdk';

import type { SeriesItem, SeriesPostCountResponse, SeriesResponse } from '~/types/series';

export function useSeries() {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { data } = useAsyncData<{ series: SeriesItem[]; total: number }>(
    'global-series',
    async (): Promise<{ series: SeriesItem[]; total: number }> => {
      const [rawSeries, rawCounts] = await Promise.all([
        directus.request<SeriesResponse[]>(
          readItems('series', {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'name', 'slug', 'description', 'thumbnail'],
            sort: ['name'],
          }),
        ),
        directus.request<SeriesPostCountResponse[]>(
          aggregate('posts_series', {
            aggregate: { count: 'posts_id' },
            groupBy: ['series_id'],
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
        if (item.series_id) {
          const count = Number(item.count.posts_id);
          countMap.set(item.series_id, count);
          total += count;
        }
      });

      const seriesWithCount: SeriesItem[] = (rawSeries || []).map((series) => {
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
  const directus = useDirectus();
  const slugRef = computed(() => unref(slug));

  const { data, pending } = useAsyncData<{ series: SeriesItem | null }>(
    () => `series-by-slug-${slugRef.value}`,
    async () => {
      if (!slugRef.value) return { series: null };

      const rawSeries = await directus.request<SeriesResponse[]>(
        readItems('series', {
          filter: {
            blog_id: { slug: { _eq: config.public.blogSlug } },
            slug: { _eq: slugRef.value },
          },
          fields: ['id', 'blog_id', 'name', 'slug', 'description', 'thumbnail'],
          limit: 1,
        }),
      );

      const [raw] = rawSeries ?? [];
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
