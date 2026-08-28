import type { MarkdownDocument } from 'comark';
import type { TocLink } from '~/components/toc-link.vue';

/**
 * 글 본문 마크다운을 파싱한다.
 *
 * useAsyncData로 감싸는 것이 핵심이다. 그냥 setup에서 await하면 SSR HTML에는 본문이 실리지만
 * 파싱 결과가 payload에 들어가지 않아, 하이드레이션 때 클라이언트가 comark + Shiki 전체를
 * 다시 돌린다. useAsyncData는 결과를 payload로 넘겨 클라이언트 재파싱을 없앤다.
 *
 * 같은 키로 여러 번 호출해도 Nuxt가 결과를 공유하므로 본문과 TOC를 각각 읽어도 파싱은 1회다.
 */
export async function usePostContent(
  postIdx: MaybeRefOrGetter<number>,
  content: MaybeRefOrGetter<string | undefined>,
) {
  const { data } = await useAsyncData<MarkdownDocument | null>(
    () => `post-tree-${toValue(postIdx)}`,
    () => {
      const source = toValue(content);
      return source ? parseContent(source) : Promise.resolve(null);
    },
    { watch: [() => toValue(postIdx)] },
  );

  return {
    // useAsyncData의 data는 undefined를 포함한다. 소비자 쪽 prop 타입을 단순하게 유지하려고 null로 좁힌다.
    tree: computed<MarkdownDocument | null>(() => data.value ?? null),
    toc: computed<TocLink[]>(() => data.value?.meta?.toc?.links ?? []),
  };
}
