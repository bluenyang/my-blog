import type { NavigationItem, NavigationListResponse } from '@/types/header';

export function useNavigationMenu() {
  const config = useRuntimeConfig();

  const { data } = useAsyncData<NavigationItem[]>(
    'global-navigation',
    async (): Promise<NavigationItem[]> => {
      const resp = await $fetch<{ data: NavigationListResponse[] }>(
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

      const menuItems: NavigationItem[] = resp.data.map((item) => {
        return {
          id: item.id,
          label: item.label,
          url: item.url,
          icon: item.icon,
          isCategory: item.is_category,
          parentId: item.parent_id,
          children: item.children,
        };
      });

      return buildTree<NavigationItem>(menuItems);
    },
  );

  return {
    menuItems: computed<NavigationItem[]>(() => data.value || []),
  };
}
