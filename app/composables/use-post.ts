import type { PostItem, RawPostItem } from '~/types/post';

export function useRecentPosts(limit = 6) {
  const config = useRuntimeConfig();

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    `recent-posts-${limit}`,
    async () => {
      const response = await $fetch<{ data: RawPostItem[] }>(
        `${config.public.directusUrl}/items/posts`,
        {
          query: {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
              status: { _eq: 'published' },
              visibility: { _eq: 'public' },
            },
            sort: ['-published_at', '-updated_at'], // 최신순 정렬
            limit,
            // 목록 표시에 필요한 필드만 가져오기 (Directus 쿼리이므로 snake_case 유지)
            fields: [
              'id',
              'post_idx',
              'title',
              'slug',
              'summary',
              'thumbnail',
              'published_at',
              'updated_at',
              'categories.categories_id.name',
              'tags.tags_id.name',
              'author_id.first_name',
              'author_id.last_name',
              'author_id.nickname',
              'author_id.avatar',
            ],
          },
        },
      );

      const rawPosts = response.data || [];
      const posts: PostItem[] = [];

      for (const rawPost of rawPosts) {
        posts.push(await rawPostItemToPostItem(rawPost));
      }

      return { posts };
    },
    {
      default: () => ({ posts: [] }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    posts: computed(() => data.value?.posts || []),
    pending,
    error,
  };
}

export function usePosts() {
  const config = useRuntimeConfig();

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    'all-posts',
    async () => {
      const response = await $fetch<{ data: RawPostItem[] }>(
        `${config.public.directusUrl}/items/posts`,
        {
          query: {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
              status: { _eq: 'published' },
              visibility: { _eq: 'public' },
            },
            sort: ['-post_idx'],
            limit: -1,
            fields: [
              'id',
              'post_idx',
              'title',
              'slug',
              'summary',
              'thumbnail',
              'published_at',
              'updated_at',
              'categories.categories_id.name',
              'tags.tags_id.name',
            ],
          },
        },
      );

      const rawPosts = response.data || [];
      const posts: PostItem[] = [];

      for (const rawPost of rawPosts) {
        posts.push(await rawPostItemToPostItem(rawPost));
      }

      return { posts };
    },
    {
      default: () => ({ posts: [] }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    posts: computed(() => data.value?.posts || []),
    pending,
    error,
  };
}

export function usePostDetail(idx: number | string) {
  const config = useRuntimeConfig();

  const { data, pending, error } = useAsyncData<{ post: PostItem | null }>(
    `post-detail-${idx}`,
    async () => {
      const response = await $fetch<{ data: RawPostItem[] }>(
        `${config.public.directusUrl}/items/posts`,
        {
          query: {
            filter: {
              blog_id: { slug: { _eq: config.public.blogSlug } },
              post_idx: { _eq: Number(idx) },
              status: { _eq: 'published' },
            },
            limit: 1,
            fields: [
              'id',
              'post_idx',
              'title',
              'slug',
              'summary',
              'thumbnail',
              'content',
              'published_at',
              'updated_at',
              'categories.categories_id.name',
              'categories.categories_id.slug',
              'tags.tags_id.name',
              'tags.tags_id.slug',
              'series.series_id.id',
              'series.series_id.name',
              'series.series_id.slug',
              'author_id.first_name',
              'author_id.last_name',
              'author_id.nickname',
              'author_id.avatar',
            ],
          },
        },
      );

      const [rawPost] = response.data ?? [];
      if (!rawPost) return { post: null };

      return { post: await rawPostItemToPostItem(rawPost) };
    },
  );

  return {
    post: computed(() => data.value?.post || null),
    pending,
    error,
  };
}

export function useSeriesPosts(seriesId: Ref<string | undefined> | string | undefined) {
  const config = useRuntimeConfig();
  const idRef = computed(() => unref(seriesId));

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    `series-posts-${idRef.value}`,
    async () => {
      if (!idRef.value) return { posts: [] };
      const response = await $fetch<{ data: RawPostItem[] }>(
        `${config.public.directusUrl}/items/posts`,
        {
          query: {
            filter: {
              blog_id: { slug: { _eq: config.public.blogSlug } },
              status: { _eq: 'published' },
              series: {
                series_id: { id: { _eq: idRef.value } },
              },
            },
            sort: ['published_at'],
            fields: [
              'id',
              'post_idx',
              'title',
              'slug',
              'summary',
              'thumbnail',
              'published_at',
              'updated_at',
              'categories.categories_id.name',
              'tags.tags_id.name',
            ],
          },
        },
      );

      const posts: PostItem[] = [];
      const rawPosts = response.data || [];
      for (const rawPost of rawPosts) {
        posts.push(await rawPostItemToPostItem(rawPost));
      }

      return { posts };
    },
    {
      immediate: !!idRef.value,
      watch: [idRef],
    },
  );

  return {
    posts: computed(() => data.value?.posts || []),
    pending,
    error,
  };
}

export interface SearchPostsOptions {
  search?: string;
  category?: string;
  tag?: string;
  series?: string;
}

export function useSearchPosts(options: Ref<SearchPostsOptions>) {
  const config = useRuntimeConfig();

  const { data, pending, error, refresh } = useAsyncData<{ posts: PostItem[] }>(
    computed(() => `search-posts-${JSON.stringify(options.value)}`).value,
    async () => {
      const { search, category, tag, series } = options.value;

      const filter: Record<string, unknown> = {
        blog_id: { slug: { _eq: config.public.blogSlug } },
        status: { _eq: 'published' },
        visibility: { _eq: 'public' },
      };

      if (search) {
        filter['_or'] = [{ title: { _contains: search } }, { summary: { _contains: search } }];
      }
      if (category) {
        filter['categories'] = { categories_id: { slug: { _eq: category } } };
      }
      if (tag) {
        filter['tags'] = { tags_id: { slug: { _eq: tag } } };
      }
      if (series) {
        filter['series'] = { series_id: { slug: { _eq: series } } };
      }

      const response = await $fetch<{ data: RawPostItem[] }>(
        `${config.public.directusUrl}/items/posts`,
        {
          query: {
            filter,
            sort: ['-post_idx'],
            limit: -1,
            fields: [
              'id',
              'post_idx',
              'title',
              'slug',
              'summary',
              'thumbnail',
              'published_at',
              'updated_at',
              'categories.categories_id.name',
              'categories.categories_id.slug',
              'tags.tags_id.name',
              'tags.tags_id.slug',
              'series.series_id.name',
              'series.series_id.slug',
            ],
          },
        },
      );

      const posts: PostItem[] = [];
      for (const rawPost of response.data || []) {
        posts.push(await rawPostItemToPostItem(rawPost));
      }
      return { posts };
    },
    {
      watch: [options],
    },
  );

  return {
    posts: computed(() => data.value?.posts || []),
    pending,
    error,
    refresh,
  };
}
