/**
 * 페이지네이션 상태를 URL(?page=)에 둔다.
 *
 * 로컬 ref로 두면 뒤로가기와 링크 공유에서 페이지가 사라지고,
 * rel=prev/next와 페이지별 canonical을 만들 수 없다.
 *
 * 1페이지에서는 ?page=1을 붙이지 않는다 — /posts 와 /posts?page=1 이 같은 내용의
 * 서로 다른 URL이 되면 중복 콘텐츠가 된다.
 */
export function usePageParam() {
  const route = useRoute();
  const router = useRouter();

  return computed<number>({
    get() {
      const raw = Number(route.query.page);
      return Number.isInteger(raw) && raw >= 1 ? raw : 1;
    },
    set(value) {
      const query = { ...route.query };
      if (value <= 1) {
        delete query.page;
      } else {
        query.page = String(value);
      }
      router.push({ query });
    },
  });
}
