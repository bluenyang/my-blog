import type { CategoryItem } from '~/types/category';

export function useCategory() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<CategoryItem[]>(
    'global-category',
    async (): Promise<CategoryItem[]> => {
      const resp = await $fetch<{ data: CategoryItem[] }>(
        `${config.public.directusUrl}/items/categories`,
        {
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
        },
      );
      return buildTree<CategoryItem>(resp.data);
    },
  );

  return {
    categories: computed<CategoryItem[]>(() => data.value || []),
  };
}
