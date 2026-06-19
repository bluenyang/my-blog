import type { NavigationItem } from '@/types/header';

export function useNavigationMenu() {
  const config = useRuntimeConfig();

  const { data, pending } = useAsyncData<NavigationItem[]>(
    'global-navigation',
    async (): Promise<NavigationItem[]> => {
      const resp = await $fetch<{ data: NavigationItem[] }>(
        `${config.public.directusUrl}/items/navigations`,
        {
          query: {
            filter: {
              blog: {
                slug: {
                  _eq: config.public.blogSlug,
                },
              },
            }, // 최상위 메뉴
            fields: ['id', 'label', 'url', 'parent_id'],
            sort: ['sort', 'id'],
          },
        },
      );
      return buildNavigationTree(resp.data);
    },
  );

  return {
    menuItems: computed<NavigationItem[]>(() => data.value || []),
    pending,
  };
}
