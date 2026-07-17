import type { SidebarContent } from '~~/shared/types';

export const useSidebar = () => {
  const isOpen = useState<boolean>('sidebar_is_open', () => false);
  const sidebar = useState<SidebarContent | null>('sidebar', () => null);
  const needSidebar = computed(() => sidebar.value === null);

  function toggle(): void {
    isOpen.value = !isOpen.value;
  }
  function close(): void {
    isOpen.value = false;
  }
  function open(): void {
    isOpen.value = true;
  }

  function setSidebarData(data: SidebarContent): void {
    sidebar.value = data;
  }

  return {
    isOpen,
    sidebar,
    needSidebar,
    toggle,
    close,
    open,
    setSidebarData,
  };
};
