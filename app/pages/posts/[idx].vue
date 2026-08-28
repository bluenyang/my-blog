<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();

  const idxParam = route.params.idx as string;
  const postIdx = parseInt(idxParam, 10);

  // /posts/abc 처럼 글 번호가 아닌 경로는 API를 때리기 전에 404로 끝낸다
  if (!Number.isInteger(postIdx) || postIdx < 0) {
    throw createError({
      statusCode: 404,
      statusMessage: '게시글을 찾을 수 없습니다.',
      fatal: true,
    });
  }

  const { settings } = useSetting();
  // await해야 setup 안에서 error.value를 읽을 수 있다 (use-post.ts 주석 참고)
  const { post, pending, error } = await usePostDetail(postIdx);

  /*
   * 없는 글만 하드 404로 끝립니다.
   *
   * 그 외의 오류(네트워크·5xx)를 fatal로 만들면 안 된다 — 프로덕션 엣지에서
   * SSR 내부 fetch가 실패하는 사례가 실제로 있고(.ai/ROADMAP.md 참고),
   * 그때 던져버리면 클라이언트가 다시 받아 스스로 복구하던 페이지가
   * 하드 에러 페이지로 바뀜다. 이 경우는 빈 상태로 두고 클라이언트 렌더에 맡긴다.
   */
  if (error.value?.statusCode === 404) {
    throw createError({
      statusCode: 404,
      statusMessage: '게시글을 찾을 수 없습니다.',
      fatal: true,
    });
  }

  if (import.meta.server && error.value) {
    console.error('[posts/:idx] SSR fetch 실패, 클라이언트 렌더로 폴백:', error.value.statusCode);
  }

  // 본문은 여기서 한 번만 파싱한다. useAsyncData가 결과를 payload로 넘겨
  // 클라이언트가 comark + Shiki를 다시 돌리지 않는다.
  const { tree, toc } = await usePostContent(
    () => postIdx,
    () => post.value?.content,
  );

  const series = computed(() => post.value?.series?.[0]);
  const seriesName = computed(() => series.value?.name);

  const seriesOrder = computed(() => {
    if (!series.value || !post.value?.postIdx) return null;
    const index = series.value.posts.findIndex((p) => p.postIdx === post.value?.postIdx);
    return index >= 0 ? index + 1 : null;
  });

  const { activeId } = useActiveHeading(toc);

  // 진행 바는 헤더 독 안에서 그려진다. 여기서는 스크롤 추적만 켠다.
  useTrackReadingProgress();

  const readingTime = computed(() => readingMinutes(post.value?.content));

  const formattedDate = computed(() => formatPostDateLong(post.value?.publishedAt));

  const categoryName = computed<string>(() => {
    if (!post.value?.categories?.length) {
      return 'Uncategorized';
    }
    return post.value.categories[0]?.name ?? 'Uncategorized';
  });

  const cclLicenseCode = computed(() => getCclLicenseCode(settings.value));

  const canonicalPath = computed(() =>
    post.value ? `/posts/${post.value.postIdx}-${post.value.slug}` : null,
  );
  const canonicalUrl = computed(() =>
    canonicalPath.value ? `${config.public.blogUrl}${canonicalPath.value}` : undefined,
  );

  // /posts/12 와 /posts/12-wrong-slug 를 정규 URL로 합쳐 중복 콘텐츠를 막음
  watch(
    canonicalPath,
    (path) => {
      if (!path || normalizeRoutePath(route.path) === normalizeRoutePath(path)) return;
      navigateTo(path, { redirectCode: 301, replace: true });
    },
    { immediate: true },
  );

  function goBack() {
    window.history.back();
  }

  const { siteName, blogUrl, author } = useBlogIdentity();

  useJsonLd(() => {
    const p = post.value;
    if (!p || !canonicalUrl.value) return null;

    const licenseUrl = getCclCreativeCommonsUrl(settings.value);

    const breadcrumb = [
      { name: '홈', item: blogUrl },
      { name: '전체 글', item: `${blogUrl}/posts` },
      ...(p.categories?.[0]
        ? [
            {
              name: p.categories[0].name,
              item: `${blogUrl}/categories/${encodeURIComponent(p.categories[0].slug)}`,
            },
          ]
        : []),
      { name: p.title, item: canonicalUrl.value },
    ];

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': `${canonicalUrl.value}#article`,
        headline: p.title,
        description: p.summary ?? undefined,
        image: p.thumbnail ?? undefined,
        datePublished: p.publishedAt,
        dateModified: p.updatedAt ?? p.publishedAt,
        mainEntityOfPage: canonicalUrl.value,
        inLanguage: 'ko-KR',
        articleSection: p.categories?.[0]?.name,
        timeRequired: readingTime.value > 0 ? `PT${readingTime.value}M` : undefined,
        keywords: p.tags?.length ? p.tags.map((tag) => tag.name).join(', ') : undefined,
        isPartOf: { '@id': `${blogUrl}#blog` },
        author,
        publisher: author,
        ...(licenseUrl ? { license: licenseUrl } : {}),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumb.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.item,
        })),
      },
    ];
  });

  useHead({
    link: () => (canonicalUrl.value ? [{ rel: 'canonical', href: canonicalUrl.value }] : []),
  });

  useSeoMeta({
    title: () => post.value?.title || 'Post',
    description: () => post.value?.summary || undefined,
    ogTitle: () => post.value?.title || 'Post',
    ogImage: () => post.value?.thumbnail || undefined,
    ogDescription: () => post.value?.summary || undefined,
    ogUrl: canonicalUrl,
    ogType: 'article',
    ogLocale: 'ko_KR',
    ogSiteName: siteName,
    twitterCard: 'summary_large_image',
    articlePublishedTime: () => post.value?.publishedAt,
    articleModifiedTime: () => post.value?.updatedAt,
  });
</script>

<template>
  <div class="w-full px-4 py-32 sm:px-6 lg:px-8">
    <LoadingState v-if="pending" />

    <EmptyState
      v-else-if="!post"
      icon="lucide:alert-circle"
      tone="error"
      title="게시글을 찾을 수 없습니다."
    />

    <div v-else class="mx-auto max-w-7xl">
      <button
        class="text-muted-foreground hover:text-primary mb-4 inline-flex items-center gap-1 transition-colors hover:underline"
        @click="goBack"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        <span class="mt-0.5">
          {{ '이전으로 돌아가기' }}
        </span>
      </button>
      <!-- Hero Section -->
      <div class="mb-8 flex flex-col items-start text-center">
        <!-- Thumbnail -->
        <div
          v-if="post.thumbnail"
          class="relative mb-8 w-full max-w-4xl overflow-hidden rounded-2xl bg-linear-to-br shadow-lg md:from-blue-200 md:to-purple-300 dark:md:from-blue-800 dark:md:to-purple-900"
        >
          <img
            :src="post.thumbnail"
            :alt="post.title"
            width="1280"
            height="640"
            loading="eager"
            fetchpriority="high"
            class="aspect-2/1 w-full object-cover"
          />
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex flex-wrap items-center justify-start gap-2 text-sm">
            <span class="text-muted-foreground font-bold">{{ categoryName }}</span>
            <template v-if="series">
              <div class="flex items-center gap-1">
                <span class="text-muted-foreground">
                  {{ '·' }}
                </span>
                <NuxtLink
                  :to="{ name: 'series-slug', params: { slug: series.slug } }"
                  class="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Icon name="lucide:layers" class="mr-1 mb-0.5 inline size-4" />
                  {{ `${seriesName} (${seriesOrder}편)` }}
                </NuxtLink>
              </div>
            </template>
          </div>

          <h1 class="mb-6 text-start text-3xl leading-tight font-bold sm:text-5xl">
            {{ post.title }}
          </h1>

          <div
            class="text-muted-foreground mb-6 flex flex-wrap items-center justify-start gap-2 text-sm"
          >
            <div class="flex items-center gap-2">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar"
                :alt="post.author.nickname ?? '작성자'"
                width="24"
                height="24"
                loading="lazy"
                decoding="async"
                class="size-6 rounded-full"
              />
              <div
                v-else
                class="bg-block-bg text-foreground flex size-6 items-center justify-center rounded-full"
              >
                <Icon name="lucide:user" class="size-4" />
              </div>
              <span class="font-medium">{{ post.author.nickname }}</span>
            </div>
            <span>{{ '·' }}</span>
            <div class="flex items-center gap-2">
              <Icon name="lucide:calendar-days" class="size-4" />
              <time :datetime="post.publishedAt || ''">{{ formattedDate }}</time>
            </div>
            <template v-if="readingTime > 0">
              <span>{{ '·' }}</span>
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:clock" class="size-4" />
                <span>{{ `약 ${readingTime}분` }}</span>
              </div>
            </template>
            <template v-if="settings?.allowCCL">
              <span>{{ '·' }}</span>
              <NuxtLink to="/license" class="hover:text-foreground transition-colors">
                <CclBadge />
              </NuxtLink>
            </template>
          </div>
        </div>

        <div
          v-if="post.tags && post.tags.length > 0"
          class="flex flex-wrap items-center justify-center gap-2"
        >
          <NuxtLink
            v-for="tag in post.tags"
            :key="tag.slug"
            :to="{ name: 'tags-slug', params: { slug: tag.slug } }"
            class="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
          >
            {{ `# ${tag.name}` }}
          </NuxtLink>
        </div>
      </div>

      <MarkdownContent
        v-if="post"
        :tree="tree"
        :toc="toc"
        :active-id="activeId"
        :series="series"
        :current-post-idx="post.postIdx"
      />

      <PostNav v-if="post" :prev="post.prev" :next="post.next" />

      <footer class="border-border mt-12 max-w-7xl border-t pt-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex items-center gap-3">
            <img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              :alt="post.author.nickname ?? '작성자'"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              class="size-12 rounded-full"
            />
            <div
              v-else
              class="bg-block-bg text-foreground flex size-12 items-center justify-center rounded-full"
            >
              <Icon name="lucide:user" class="size-6" />
            </div>
            <div class="flex flex-col gap-0.5">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">
                {{ '작성자' }}
              </span>
              <span class="text-foreground text-base font-semibold">
                {{ post.author.nickname }}
              </span>
            </div>
          </div>

          <div v-if="settings?.allowCCL" class="flex flex-col gap-2 sm:items-end">
            <span class="text-muted-foreground text-xs tracking-wide uppercase">
              {{ '라이선스' }}
            </span>
            <NuxtLink
              to="/license"
              class="text-muted-foreground hover:text-primary inline-flex flex-wrap items-center gap-2 transition-colors sm:justify-end"
            >
              <CclBadge />
              <span class="text-sm">{{ cclLicenseCode }}</span>
              <Icon name="lucide:arrow-up-right" class="size-3.5" />
            </NuxtLink>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>
