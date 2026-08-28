interface PaginationSeoOptions {
  /** 1페이지의 정규 URL. 쿼리가 없는 형태여야 한다. */
  baseUrl: MaybeRefOrGetter<string | undefined>;
  page: MaybeRefOrGetter<number>;
  totalPages: MaybeRefOrGetter<number>;
}

/**
 * 페이지네이션 목록의 canonical / rel=prev / rel=next / robots를 계산한다.
 *
 * 2페이지 이후는 자기 자신을 canonical로 가리키고 noindex, follow를 준다.
 * 1페이지로 canonical을 몰아주면 색인에서 사라진 페이지의 링크가 크롤되지 않고,
 * 그대로 두면 제목·설명이 같은 페이지가 여러 개 색인돼 중복 콘텐츠가 된다.
 * follow는 유지해 목록의 글 링크는 계속 발견되게 한다.
 */
export function usePaginationSeo({ baseUrl, page, totalPages }: PaginationSeoOptions) {
  const pageUrl = (n: number) => {
    const base = toValue(baseUrl);
    if (!base) return undefined;
    return n <= 1 ? base : `${base}?page=${n}`;
  };

  const canonical = computed(() => pageUrl(toValue(page)));
  const prev = computed(() => (toValue(page) > 1 ? pageUrl(toValue(page) - 1) : undefined));
  const next = computed(() => {
    const current = toValue(page);
    const total = toValue(totalPages);
    return total > 0 && current < total ? pageUrl(current + 1) : undefined;
  });

  const robots = computed(() => (toValue(page) > 1 ? 'noindex, follow' : undefined));

  return { canonical, prev, next, robots };
}
