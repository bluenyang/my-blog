import { readItems } from '@directus/sdk';

import type { NavigationItem, NavigationListResponse } from '@/types/header';

export function useNavigationMenu() {
  const config = useRuntimeConfig();
  const directus = useDirectus();

  const { data } = useAsyncData<NavigationItem[]>(
    'global-navigation',
    async (): Promise<NavigationItem[]> => {
      const rawItems = await directus.request<NavigationListResponse[]>(
        readItems('navigations', {
          filter: {
            blog_id: {
              slug: {
                _eq: config.public.blogSlug,
              },
            },
          },
          fields: ['id', 'label', 'url', 'icon', 'is_category', 'parent_id'],
          sort: ['sort_order', 'id'],
        }),
      );

      const menuItems: NavigationItem[] = (rawItems || []).map((item) => {
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
    {
      default: () => [],
      getCachedData(key, nuxtApp) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      },
    },
  );

  return {
    menuItems: computed<NavigationItem[]>(() => data.value || []),
  };
}
