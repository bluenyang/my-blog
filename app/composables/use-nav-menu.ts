import type { NavigationItem } from '@/types/header';

export function useNavigationMenu() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<NavigationItem[]>(
    'global-navigation',
    async (): Promise<NavigationItem[]> => {
      const resp = await $fetch<{ data: NavigationItem[] }>(
        `${config.public.directusUrl}/items/navigations`,
        {
          query: {
            filter: {
              blog_id: {
                slug: {
                  _eq: config.public.blogSlug,
                },
              },
            }, // 최상위 메뉴
            fields: ['id', 'label', 'url', 'icon', 'is_category', 'parent_id'],
            sort: ['sort_order', 'id'],
          },
        },
      );
      return buildTree<NavigationItem>(resp.data);
    },
  );

  return {
    menuItems: computed<NavigationItem[]>(() => data.value || []),
  };
}
