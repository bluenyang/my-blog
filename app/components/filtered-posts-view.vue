<script setup lang="ts">
  import { cn } from '~/utils/cn';

  const props = defineProps<{
    search?: string;
    category?: string;
    tag?: string;
    series?: string;
  }>();

  const config = useRuntimeConfig();

  const limit = 10;
  const currentPage = usePageParam();

  const options = computed(() => {
    return {
      search: props.search,
      category: props.category,
      tag: props.tag,
      series: props.series,
    };
  });

  // 필터가 바뀌면 이전 필터의 페이지 번호가 URL에 남아 있으면 안 된다
  watch(
    () => [props.search, props.category, props.tag, props.series],
    () => {
      if (currentPage.value !== 1) {
        currentPage.value = 1;
      }
    },
  );

  const { posts, pending, error, metadata, totalCount } = usePostList(
    limit,
    currentPage,
    () => options.value.search,
    () => options.value.category,
    () => options.value.tag,
    () => options.value.series,
  );

  // API searchType보다 props로 타입을 정해 SSR/클라이언트 헤더가 어긋나지 않게 함
  const resolvedType = computed(() => resolveSearchType(options.value));

  const eyebrow = computed(() => {
    if (resolvedType.value === 'series') {
      return 'Series';
    }
    if (resolvedType.value === 'category') {
      return 'Category';
    }
    if (resolvedType.value === 'tag') {
      return 'Tag';
    }
    return 'Search';
  });

  const iconName = computed(() => {
    if (resolvedType.value === 'series') {
      return 'lucide:layers';
    }
    if (resolvedType.value === 'category') {
      return 'lucide:folder';
    }
    if (resolvedType.value === 'tag') {
      return 'lucide:tag';
    }
    return 'lucide:search';
  });

  const pageTitle = computed(() => {
    if (resolvedType.value === 'series') {
      return metadata.value?.name ? `${metadata.value.name} 시리즈` : '시리즈';
    }
    if (resolvedType.value === 'category') {
      return metadata.value?.name ? `카테고리 · ${metadata.value.name}` : '카테고리';
    }
    if (resolvedType.value === 'tag') {
      return metadata.value?.name ? `태그 · #${metadata.value.name}` : '태그';
    }
    return options.value.search ? `"${options.value.search}" 검색 결과` : '검색 결과';
  });

  const pageDesc = computed(() => {
    const count = metadata.value?.totalCount;
    if (resolvedType.value === 'series') {
      return count != null ? `시리즈에 포함된 ${count}개의 글` : '';
    }
    if (resolvedType.value === 'category') {
      return count != null ? `카테고리에 포함된 ${count}개의 글` : '';
    }
    if (resolvedType.value === 'tag') {
      return count != null ? `태그가 붙은 ${count}개의 글` : '';
    }
    if (!options.value.search) {
      return '검색어를 입력해 주세요.';
    }
    return count != null ? `총 ${count}개의 글이 검색됐습니다.` : '';
  });

  const pageCanonicalUrl = computed(() => {
    if (resolvedType.value === 'search') {
      const q = options.value.search ? `?search=${encodeURIComponent(options.value.search)}` : '';
      return `${config.public.blogUrl}/search${q}`;
    }
    if (resolvedType.value === 'category') {
      return `${config.public.blogUrl}/categories/${encodeURIComponent(props.category ?? '')}`;
    }
    if (resolvedType.value === 'tag') {
      return `${config.public.blogUrl}/tags/${encodeURIComponent(props.tag ?? '')}`;
    }
    if (resolvedType.value === 'series') {
      return `${config.public.blogUrl}/series/${encodeURIComponent(props.series ?? '')}`;
    }
    return `${config.public.blogUrl}`;
  });

  const totalPages = computed(() => Math.ceil(totalCount.value / limit));

  const {
    canonical,
    prev,
    next,
    robots: paginationRobots,
  } = usePaginationSeo({
    // 검색 결과는 canonical을 주지 않는다 (이미 noindex)
    baseUrl: () => (resolvedType.value === 'search' ? undefined : pageCanonicalUrl.value),
    page: currentPage,
    totalPages,
  });

  const { siteName, blogUrl, author } = useBlogIdentity();

  useJsonLd(() => {
    // 검색 결과는 이미 noindex이고, 2페이지 이후도 색인 대상이 아니다
    if (resolvedType.value === 'search' || currentPage.value !== 1) return null;
    const url = pageCanonicalUrl.value;
    if (!url) return null;

    const isSeries = resolvedType.value === 'series';

    return [
      {
        '@context': 'https://schema.org',
        '@type': isSeries ? ['CollectionPage', 'CreativeWorkSeries'] : 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: metadata.value?.name ?? pageTitle.value,
        description: metadata.value?.description ?? undefined,
        image: isSeries ? (metadata.value?.thumbnail ?? undefined) : undefined,
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
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: blogUrl },
          { '@type': 'ListItem', position: 2, name: '전체 글', item: `${blogUrl}/posts` },
          {
            '@type': 'ListItem',
            position: 3,
            name: metadata.value?.name ?? pageTitle.value,
            item: url,
          },
        ],
      },
    ];
  });

  useHead({
    link: () => [
      ...(canonical.value ? [{ rel: 'canonical' as const, href: canonical.value }] : []),
      ...(prev.value ? [{ rel: 'prev' as const, href: prev.value }] : []),
      ...(next.value ? [{ rel: 'next' as const, href: next.value }] : []),
    ],
  });

  useSeoMeta({
    title: pageTitle,
    description: pageDesc,
    ogTitle: pageTitle,
    ogDescription: pageDesc,
    ogUrl: pageCanonicalUrl,
    ogImage: () =>
      resolvedType.value === 'series'
        ? metadata.value?.thumbnail
        : `${config.public.blogUrl}/images/og-default.jpg`,
    ogType: 'website',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    // 검색 결과 페이지와 2페이지 이후는 색인하지 않아 thin/duplicate를 피함
    robots: () => (resolvedType.value === 'search' ? 'noindex, follow' : paginationRobots.value),
  });

  const currentPageText = computed(() => {
    return `총 ${Math.ceil(totalCount.value / limit)}페이지 중 ${currentPage.value}페이지`;
  });
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <div
      v-if="resolvedType === 'series' && metadata?.thumbnail"
      class="mb-8 w-full overflow-hidden rounded-2xl shadow-md"
    >
      <img
        :src="metadata?.thumbnail"
        :alt="metadata?.name ?? ''"
        width="1200"
        height="400"
        loading="eager"
        class="aspect-3/1 w-full object-cover"
      />
    </div>

    <div class="border-border border-b-2 pb-2">
      <div class="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Icon :name="iconName" class="size-4" />
        <span class="tracking-widest uppercase">{{ eyebrow }}</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ pageTitle }}</h1>
      <p class="text-muted-foreground mt-3 text-lg">
        {{ resolvedType === 'series' ? metadata?.description : pageDesc }}
      </p>
      <p class="text-muted-foreground mt-3 text-end text-base">{{ currentPageText }}</p>
    </div>

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
      icon="lucide:search-x"
      :title="resolvedType === 'search' ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'"
    />

    <template v-else>
      <div class="divide-border flex flex-col divide-y">
        <PostRow
          v-for="post in posts"
          :key="post.postIdx"
          :post="post"
          :show-series="resolvedType !== 'series'"
        />
      </div>

      <Pagination
        v-model:current="currentPage"
        :total="metadata?.totalCount ?? totalCount"
        :limit="limit"
      />
    </template>
  </main>
</template>
