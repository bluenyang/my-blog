/**
 * body 스크롤 락을 여러 컴포넌트가 함께 쓸 수 있게 한다.
 *
 * useScrollLock을 컴포넌트마다 따로 호출하면 각자 독립된 ref를 갖는데 대상은 같은
 * document.body다. 그래서 모바일 사이드바가 잠근 상태에서 팔레트를 열었다 닫으면
 * 팔레트 쪽 인스턴스가 락을 풀어버려, 사이드바가 열려 있는데도 배경이 스크롤된다.
 *
 * 소유자 목록을 공유 상태로 두고, 하나라도 잡고 있으면 잠근 채로 유지한다.
 */
export function useBodyScrollLock(id: string) {
  const holders = useState<Record<string, boolean>>('body-scroll-lock', () => ({}));
  const isLocked = useScrollLock(import.meta.client ? document.body : null);

  const anyHeld = computed(() => Object.values(holders.value).some(Boolean));

  watch(
    anyHeld,
    (held) => {
      isLocked.value = held;
    },
    { immediate: true },
  );

  onScopeDispose(() => {
    if (!holders.value[id]) return;
    holders.value = { ...holders.value, [id]: false };
  });

  return {
    lock(value: boolean) {
      if (Boolean(holders.value[id]) === value) return;
      holders.value = { ...holders.value, [id]: value };
    },
  };
}
