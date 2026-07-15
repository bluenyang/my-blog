import { aggregate, readItems } from '@directus/sdk';

import type { CategoryItem, RawCategoryItem, RawCategoryPostCount } from '~/types/category';
import { accumulatePostCount } from '~/utils/post-counter';

export function useCategory() {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { data } = useAsyncData<{ categories: CategoryItem[]; total: number }>(
    'global-category',
    async (): Promise<{ categories: CategoryItem[]; total: number }> => {
      const [rawCategories, rawCounts] = await Promise.all([
        directus.request<RawCategoryItem[]>(
          readItems('categories', {
            filter: {
              blog_id: {
                slug: { _eq: config.public.blogSlug },
              },
            },
            fields: ['id', 'blog_id', 'parent_id', 'name', 'icon', 'slug'],
            sort: ['sort_order', 'slug'],
          }),
        ),
        directus.request<RawCategoryPostCount[]>(
          aggregate('posts_categories', {
            aggregate: { count: 'posts_id' },
            groupBy: ['categories_id'],
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
      (rawCounts || []).forEach((item) => {
        if (item.categories_id) {
          countMap.set(item.categories_id, Number(item.count.posts_id));
        }
      });

      const categoriesWithCount: CategoryItem[] = (rawCategories || []).map((category) => {
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
