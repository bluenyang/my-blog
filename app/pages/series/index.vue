<script setup lang="ts">
  const { sidebar, pending, error } = useSidebar();
  const { siteName, blogUrl } = useBlogIdentity();

  const series = computed(() =>
    [...(sidebar.value?.series.items ?? [])].sort(
      (a, b) => (b.postCount ?? 0) - (a.postCount ?? 0) || a.name.localeCompare(b.name),
    ),
  );

  const canonicalUrl = `${blogUrl}/series`;
  const pageDesc = '주제별로 이어지는 글 묶음입니다.';

  useJsonLd(() => ({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#collection`,
    url: canonicalUrl,
    name: '시리즈',
    description: pageDesc,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': `${blogUrl}#blog` },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: series.value.length,
      itemListElement: series.value.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: `${blogUrl}/series/${encodeURIComponent(item.slug)}`,
      })),
    },
  }));

  useHead({ link: [{ rel: 'canonical', href: canonicalUrl }] });

  useSeoMeta({
    title: '시리즈',
    description: pageDesc,
    ogTitle: '시리즈',
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
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ '시리즈' }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">{{ pageDesc }}</p>
    </div>

    <LoadingState v-if="pending && !series.length" />

    <EmptyState
      v-else-if="error"
      icon="lucide:alert-circle"
      tone="error"
      title="시리즈를 불러오지 못했습니다."
      :description="error.message"
    />

    <EmptyState v-else-if="!series.length" icon="lucide:layers" title="등록된 시리즈가 없습니다." />

    <ul v-else class="mt-10 grid gap-6 sm:grid-cols-2">
      <li v-for="item in series" :key="item.slug">
        <NuxtLink
          :to="{ name: 'series-slug', params: { slug: item.slug } }"
          class="bg-card border-border hover:border-primary group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-colors"
        >
          <img
            v-if="item.thumbnail"
            :src="item.thumbnail"
            :alt="item.name"
            width="1200"
            height="400"
            loading="lazy"
            decoding="async"
            class="aspect-3/1 w-full object-cover"
          />
          <div class="flex flex-1 flex-col gap-2 p-5">
            <h2 class="group-hover:text-primary text-xl font-bold transition-colors">
              {{ item.name }}
            </h2>
            <p v-if="item.description" class="text-muted-foreground line-clamp-2 text-sm">
              {{ item.description }}
            </p>
            <span class="text-muted-foreground mt-auto pt-2 text-xs">
              {{ `${item.postCount ?? 0}개의 글` }}
            </span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>
