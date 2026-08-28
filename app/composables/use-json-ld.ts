type JsonLd = Record<string, unknown>;

/**
 * schema.org JSON-LD를 <head>에 심는다.
 *
 * getter로 받는 것이 중요하다 — 데이터가 fetch 이후에 도착해도 다시 직렬화된다.
 * SSR HTML에 그대로 포함되므로 크롤러가 추가 요청 없이 읽는다.
 */
export function useJsonLd(payload: MaybeRefOrGetter<JsonLd | JsonLd[] | null | undefined>) {
  useHead({
    script: () => {
      const value = toValue(payload);
      if (!value) return [];

      return [
        {
          type: 'application/ld+json',
          // JSON-LD는 </script> 시퀀스만 막으면 되고 나머지는 그대로 둬야 파싱된다
          innerHTML: JSON.stringify(value).replace(/</g, '\u003c'),
        },
      ];
    },
  });
}
