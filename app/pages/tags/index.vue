<script setup lang="ts">
  const { sidebar, pending, error } = useSidebar();
  const { siteName, blogUrl } = useBlogIdentity();

  // 서버에서 이미 글 수 내림차순 상위 20개로 잘라 보낸다 (tag.mapper.ts)
  const tags = computed(() => sidebar.value?.tags.items ?? []);

  const maxCount = computed(() => Math.max(...tags.value.map((tag) => tag.postCount ?? 0), 1));

  /** 글이 많은 태그일수록 크게 — 12px에서 18px 사이 */
  function fontSize(count: number | undefined) {
    const ratio = Math.min((count ?? 0) / maxCount.value, 1);
    return `${(12 + ratio * 6).toFixed(1)}px`;
  }

  const canonicalUrl = `${blogUrl}/tags`;
  const pageDesc = '글이 많은 태그가 더 크게 보입니다.';

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: '태그',
    description: pageDesc,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${blogUrl}#blog` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: tags.value.length,
      itemListElement: tags.value.map((tag, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tag.name,
        url: `${blogUrl}/tags/${encodeURIComponent(tag.slug)}`,
      })),
    },
  }));

  useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] });

  useSeoMeta({
    title: '태그',
    description: pageDesc,
    ogTitle: '태그',
    ogDescription: pageDesc,
    ogUrl: canonicalUrl,
    ogImage: `${blogUrl}/images/og-default.jpg`,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
  });
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <div class="border-border border-b-2 pb-2">
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ '태그' }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">{{ pageDesc }}</p>
    </div>

    <LoadingState v-if="pending && !tags.length" />

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="태그를 불러오지 못했습니다."
      :description="error.message"
    />

    <EmptyState v-else-if="!tags.length" icon="lucide:tag" title="등록된 태그가 없습니다." />

    <ul v-else class="mt-10 flex flex-wrap items-center gap-3">
      <li v-for="tag in tags" :key="tag.slug">
        <NuxtLink
          :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
          class="bg-sidebar-accent hover:bg-sidebar-accent-hover text-sidebar-foreground flex min-h-11 items-baseline gap-2 rounded-xl px-4 py-2 font-medium transition-colors"
          :style="{ fontSize: fontSize(tag.postCount) }"
        >
          <span>{{ tag.name }}</span>
          <span class="text-muted-foreground text-xs">{{ tag.postCount ?? 0 }}</span>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
