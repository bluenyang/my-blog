import type { SidebarContent } from '~~/shared/types';

export const useSidebar = () => {
  const isOpen = useState<boolean>('sidebar_is_open', () => false);
  const requestFetch = useRequestFetch();

  const { data, pending, error } = useFetch<SidebarContent>('/api/sidebar', {
    method: 'GET',
    key: 'sidebar',
    $fetch: requestFetch as typeof $fetch,
    getCachedData(cacheKey, nuxtApp) {
      if (nuxtApp.isHydrating) {
        return nuxtApp.payload.data[cacheKey] ?? nuxtApp.static.data[cacheKey];
      }
    },
  });

  function toggle(): void {
    isOpen.value = !isOpen.value;
  }
  function close(): void {
    isOpen.value = false;
  }
  function open(): void {
    isOpen.value = true;
  }
  return {
    isOpen,
    sidebar: computed(() => data.value ?? undefined),
    pending,
    error,
    toggle,
    close,
    open,
  };
};
