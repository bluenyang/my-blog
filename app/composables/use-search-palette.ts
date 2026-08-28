/** ⌘K 팔레트의 열림 상태. 헤더 버튼과 팔레트가 공유한다. */
export function useSearchPalette() {
  const isOpen = useState<boolean>('search-palette-open', () => false);

  return {
    isOpen,
    open: () => {
      isOpen.value = true;
    },
    close: () => {
      isOpen.value = false;
    },
    toggle: () => {
      isOpen.value = !isOpen.value;
    },
  };
}
