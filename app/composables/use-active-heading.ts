import type { TocLink } from '~/components/toc-link.vue';

function flatten(links: TocLink[]): string[] {
  return links.flatMap((link) => [link.id, ...flatten(link.children ?? [])]);
}

/**
 * 현재 화면에 보이는 제목을 TOC 활성 항목으로 표시한다.
 *
 * IntersectionObserver를 쓰되, 화면에 여러 제목이 걸릴 때는 문서 순서상 가장 위쪽을 고른다.
 * rootMargin의 위쪽 값은 고정 헤더에 가려지는 영역을 잘라내기 위한 것이다 —
 * 헤더는 h-18(72px)이고 스크롤 시 top이 12px 내려가므로 -80px로 잡았다.
 */
export function useActiveHeading(links: MaybeRefOrGetter<TocLink[]>) {
  const activeId = ref('');
  let observer: IntersectionObserver | null = null;
  const visible = new Set<string>();

  function pickTopmost() {
    const ids = flatten(toValue(links));
    const first = ids.find((id) => visible.has(id));
    if (first) activeId.value = first;
  }

  function observe() {
    observer?.disconnect();
    visible.clear();

    const ids = flatten(toValue(links));
    if (!ids.length) {
      activeId.value = '';
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }
        pickTopmost();
      },
      { rootMargin: '-80px 0px -55% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }

    activeId.value = ids[0] ?? '';
  }

  onMounted(() => {
    // 본문이 렌더된 뒤에 관찰을 시작해야 heading 노드가 존재한다
    nextTick(observe);
  });

  watch(
    () => toValue(links),
    () => nextTick(observe),
  );

  onBeforeUnmount(() => observer?.disconnect());

  return { activeId };
}
