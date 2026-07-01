import type {
  CategoryItem,
  CategoryListResponse,
  CategoryPostCountResponse,
} from '~/types/category';
import { accumulatePostCount } from '~/utils/post-counter';

export function useCategory() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<{ categories: CategoryItem[]; total: number }>(
    'global-category',
    async (): Promise<{ categories: CategoryItem[]; total: number }> => {
      // 카테고리 목록 조회 및 포스트 갯수 집계를 Promise.all로 병렬 처리
      const [categoriesReq, countsReq] = await Promise.all([
        // Category 조회
        $fetch<{ data: CategoryListResponse[] }>(`${config.public.directusUrl}/items/categories`, {
          query: {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'parent_id', 'name', 'icon', 'slug'],
            sort: ['sort_order', 'slug'],
          },
        }),
        // 포스트 수 집계
        $fetch<{ data: CategoryPostCountResponse[] }>(
          `${config.public.directusUrl}/items/posts_categories`,
          {
            query: {
              aggregate: { count: 'posts_id' },
              groupBy: ['categories_id'],
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

      const rawCategories = categoriesReq.data;
      const rawCounts = countsReq.data;

      const countMap = new Map<string, number>();
      rawCounts.forEach((item) => {
        if (item.categories_id) {
          countMap.set(item.categories_id, Number(item.count.posts_id));
        }
      });

      const categoriesWithCount: CategoryItem[] = rawCategories.map((category) => {
        return {
          id: category.id,
          blogId: category.blog_id,
          parentId: category.parent_id,
          name: category.name,
          icon: category.icon,
          slug: category.slug,
          postCount: countMap.get(category.id) || 0,
        };
      });

      const tree = buildTree<CategoryItem>(categoriesWithCount);
      const total = accumulatePostCount(tree);
      return { categories: tree, total };
    },
    {
      default: () => ({ categories: [], total: 0 }),
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    categories: computed<CategoryItem[]>(() => data.value?.categories || []),
    total: computed<number>(() => data.value?.total || 0),
  };
}
