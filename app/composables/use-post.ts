import type { PostItem, PostListResponse } from '~/types/post';

export function useRecentPosts(limit = 6) {
  const config = useRuntimeConfig();

  const { data, pending, error } = useAsyncData<{ posts: PostItem[] }>(
    `recent-posts-${limit}`,
    async () => {
      const response = await $fetch<{ data: PostListResponse[] }>(
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
            ],
          },
        },
      );

      const rawPosts = response.data || [];
      const posts: PostItem[] = rawPosts.map((post) => ({
        id: post.id,
        blogId: post.blog_id,
        authorId: post.author_id,
        postIdx: post.post_idx,
        title: post.title,
        slug: post.slug,
        summary: post.summary,
        thumbnail: post.thumbnail,
        status: post.status,
        visibility: post.visibility,
        publishedAt: post.published_at,
        updatedAt: post.updated_at,
        categories: post.categories,
        tags: post.tags,
        series: post.series,
      }));

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
