import type {
  CategoryItem,
  CategoryListResponse,
  CategoryPostCountResponse,
} from '~/types/category';

export function useCategory() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<CategoryItem[]>(
    'global-category',
    async (): Promise<CategoryItem[]> => {
      // 카테고리 목록 조회 및 포스트 갯수 집계를 Promise.all로 병렬 처리
      const [categoriesReq, countsReq] = await Promise.all([
        // Category 조회
        $fetch<{ data: CategoryListResponse[] }>(`${config.public.directusUrl}/items/categories`, {
          query: {
            filter: {
              blog_id: {
                slug: {
                  _eq: config.public.blogSlug,
                },
              },
            },
            fields: ['id', 'blog_id', 'parent_id', 'name', 'icon', 'slug'],
            sort: ['sort_order', 'slug'],
          },
        }),
        // 포스트 수 집계
        $fetch<{ data: CategoryPostCountResponse[] }>(`${config.public.directusUrl}/items/posts`, {
          query: {
            filter: {
              status: { _eq: 'published' },
              blog_id: { slug: { _eq: config.public.blogSlug } },
            },
            groupBy: ['category_id'],
            aggregate: { count: '* ' },
          },
        }),
      ]);

      const rawCategories = categoriesReq.data;
      const rawCounts = countsReq.data;

      const countMap = new Map<string, number>();
      rawCounts.forEach((item) => {
        if (item.category_id) {
          countMap.set(item.category_id, Number(item.count));
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

      return buildTree<CategoryItem>(categoriesWithCount);
    },
    {
      default: () => [],
    },
  );

  return {
    categories: computed<CategoryItem[]>(() => data.value || []),
  };
}
