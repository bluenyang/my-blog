export const useSidebar = () => {
  const isOpen = useState<boolean>('sidebar_is_open', () => true);

  const toggle = (): void => {
    isOpen.value = !isOpen.value;
  };
  const close = (): void => {
    isOpen.value = false;
  };
  const open = (): void => {
    isOpen.value = true;
  };

  return {
    isOpen,
    toggle,
    close,
    open,
  };
};
