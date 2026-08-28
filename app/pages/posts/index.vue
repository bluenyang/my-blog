<script setup lang="ts">
  const config = useRuntimeConfig();

  const limit = 10;
  const currentPage = usePageParam();
  const { posts, pending, error, totalCount } = usePostList(limit, currentPage);

  const currentPageText = computed(() => {
    return `총 ${Math.ceil(totalCount.value / limit)}페이지 중 ${currentPage.value}페이지`;
  });

  const canonicalUrl = `${config.public.blogUrl}/posts`;
  const totalPages = computed(() => Math.ceil(totalCount.value / limit));

  const { canonical, prev, next, robots } = usePaginationSeo({
    baseUrl: canonicalUrl,
    page: currentPage,
    totalPages,
  });

  const { siteName, blogUrl, author } = useBlogIdentity();

  // noindex인 2페이지 이후에는 ItemList를 먹이지 않는다
  useJsonLd(() => {
    if (currentPage.value !== 1) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collection`,
      url: canonicalUrl,
      name: '전체 글',
      inLanguage: 'ko-KR',
      isPartOf: { '@id': `${blogUrl}#blog` },
      mainEntity: {
        '@type': 'ItemList',
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        numberOfItems: totalCount.value,
        itemListElement: (posts.value ?? []).map((post, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${blogUrl}/posts/${post.postIdx}-${post.slug}`,
          name: post.title,
        })),
      },
      author,
    };
  });

  useHead({
    link: () => [
      ...(canonical.value ? [{ rel: 'canonical' as const, href: canonical.value }] : []),
      ...(prev.value ? [{ rel: 'prev' as const, href: prev.value }] : []),
      ...(next.value ? [{ rel: 'next' as const, href: next.value }] : []),
    ],
  });

  useSeoMeta({
    title: 'All Posts',
    description: 'BlueNyang의 개발 log',
    ogTitle: 'All Posts',
    ogImage: `${config.public.blogUrl}/images/og-default.jpg`,
    ogDescription: 'BlueNyang의 개발 log',
    ogUrl: canonicalUrl,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    robots,
  });
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <div class="border-border border-b-2 pb-2">
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ '전체 글' }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">
        {{ '지금까지 작성된 모든 글을 확인해 보세요.' }}
      </p>
      <p class="text-muted-foreground mt-4 text-end text-base">{{ currentPageText }}</p>
    </div>

    <!-- 로딩 상태 -->
    <LoadingState v-if="pending" />

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="게시글을 불러오는데 실패했습니다."
      :description="error.message"
    />

    <EmptyState
      v-else-if="posts.length === 0"
      icon="lucide:file-text"
      title="등록된 게시글이 없습니다."
    />

    <!-- 리스트 형태 게시글 -->
    <template v-else>
      <div class="divide-border flex flex-col divide-y">
        <PostRow v-for="post in posts" :key="post.postIdx" :post="post" />
      </div>

      <Pagination v-model:current="currentPage" :total="totalCount" :limit="limit" />
    </template>
  </main>
</template>
