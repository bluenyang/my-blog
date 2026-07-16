import { readItems } from '@directus/sdk';

import type { PostDetailStruct, PostItem, RawPostItem } from '~/types/post';
import { rawPostItemToPostItem, rawPostsToPostItems } from '~/utils/post-mapper';

export function useRecentPosts(limit = 6) {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    `recent-posts-${limit}`,
    async () => {
      const rawPosts = await directus.request<RawPostItem[]>(
        readItems('posts', {
          filter: {
            blog_id: { slug: { _eq: config.public.blogSlug } },
            status: { _eq: 'published' },
            visibility: { _eq: 'public' },
          },
          sort: ['-published_at', '-updated_at'],
          limit,
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
        }),
      );

      const posts = await rawPostsToPostItems(rawPosts || []);
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
  const directus = useDirectus();

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    'all-posts',
    async () => {
      const rawPosts = await directus.request<RawPostItem[]>(
        readItems('posts', {
          filter: {
            blog_id: { slug: { _eq: config.public.blogSlug } },
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
        }),
      );

      const posts = await rawPostsToPostItems(rawPosts || []);
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
  const directus = useDirectus();

  const { data, pending, error } = useAsyncData<PostDetailStruct>(
    `post-detail-${idx}`,
    async () => {
      const rawPosts = await directus.request<RawPostItem[]>(
        readItems('posts', {
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
        }),
      );

      const [rawPost] = rawPosts ?? [];
      if (!rawPost) {
        return { post: null, seriesPosts: [] };
      }

      const post = await rawPostItemToPostItem(rawPost);
      if (post.series && post.series.length > 0) {
        const [series] = post.series;
        if (series) {
          const rawSeriesPosts = await directus.request<RawPostItem[]>(
            readItems('posts', {
              filter: {
                blog_id: { slug: { _eq: config.public.blogSlug } },
                series: { series_id: { id: { _eq: series.id } } },
                status: { _eq: 'published' },
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
            }),
          );

          const seriesPosts = await rawPostsToPostItems(rawSeriesPosts || []);

          return {
            post,
            seriesPosts,
          };
        }
      }

      return {
        post,
        seriesPosts: [],
      };
    },
  );

  return {
    post: computed(() => data.value?.post || null),
    seriesPosts: computed(() => data.value?.seriesPosts || []),
    pending: computed(() => pending.value),
    error: computed(() => error.value),
  };
}

export interface SearchPostsOptions {
  search?: string;
  category?: string;
  tag?: string;
  series?: string;
}

export function useSearchPosts(options: MaybeRefOrGetter<SearchPostsOptions>) {
  const config = useRuntimeConfig();
  const directus = useDirectus();
  const optionsRef = computed(() => toValue(options));

  const { data, pending, error, refresh } = useAsyncData<{ posts: PostItem[] }>(
    () => `search-posts-${JSON.stringify(optionsRef.value)}`,
    async () => {
      const { search, category, tag, series } = optionsRef.value;

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

      const rawPosts = await directus.request<RawPostItem[]>(
        readItems('posts', {
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
        }),
      );

      const posts = await rawPostsToPostItems(rawPosts || []);
      return { posts };
    },
    {
      watch: [optionsRef],
      default: () => ({ posts: [] }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return { posts: computed(() => data.value?.posts || []), pending, error, refresh };
}
