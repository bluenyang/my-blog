<script setup lang="ts">
  const { siteName, description, blogUrl, author } = useBlogIdentity();

  /*
   * 사이트 전역 구조화 데이터.
   * SearchAction의 target은 실제 검색 라우트와 파라미터 이름이 맞아야 한다 —
   * search/index.vue가 route.query.search를 읽으므로 ?search= 이다.
   */
  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${blogUrl}#website`,
    url: blogUrl,
    name: siteName,
    description,
    inLanguage: 'ko-KR',
    publisher: author,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${blogUrl}/search?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }));

  useHead({
    // 문자열 템플릿은 제목 없는 페이지에서 " · BlueNyang's Dev-log"로 렌더된다
    titleTemplate: (title) => (title ? `${title} · ${siteName}` : siteName),
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'BlueNyang Dev Blog RSS Feed',
        href: '/rss.xml',
      },
    ],
    meta: [
      {
        name: 'naver-site-verification',
        content: '133e30ab5b462674060b7764da34e7307173f594',
      },
    ],
  });
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="oklch(58.8% 0.158 241.966)" :height="4" :throttle="100" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>
