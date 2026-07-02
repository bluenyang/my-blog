<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import { useSearchPosts, type SearchPostsOptions } from '~/composables/use-post';
  import { useSeriesBySlug } from '~/composables/use-series';
  import type { PostItem } from '~/types/post';

  const config = useRuntimeConfig();
  const route = useRoute();

  const searchOptions = computed<SearchPostsOptions>(() => ({
    search: (route.query.search as string) || undefined,
    category: (route.query.category as string) || undefined,
    tag: (route.query.tag as string) || undefined,
    series: (route.query.series as string) || undefined,
  }));

  const { posts, pending, error } = useSearchPosts(searchOptions);

  // 어떤 필터가 활성화됐는지 계산
  const activeFilter = computed(() => {
    const { search, category, tag, series } = searchOptions.value;
    if (series) return { type: 'series', value: series } as const;
    if (category) return { type: 'category', value: category } as const;
    if (tag) return { type: 'tag', value: tag } as const;
    if (search) return { type: 'search', value: search } as const;
    return null;
  });

  const seriesSlug = computed(() =>
    activeFilter.value?.type === 'series' ? activeFilter.value.value : undefined,
  );

  // series 필터일 때 시리즈 자체 정보(thumbnail, description 등) 조회
  const { series: seriesInfo } = useSeriesBySlug(seriesSlug);

  const seriesThumbnailUrl = computed(() => {
    if (!seriesInfo.value?.thumbnail) return null;
    return `${config.public.directusUrl}/assets/${seriesInfo.value.thumbnail}?width=1200&height=400&fit=cover`;
  });

  const pageTitle = computed(() => {
    const f = activeFilter.value;
    if (!f) return '검색';
    if (f.type === 'series') return seriesInfo.value?.name ?? f.value;
    const labels: Record<string, string> = {
      category: `카테고리 · ${f.value}`,
      tag: `태그 · #${f.value}`,
      search: `"${f.value}" 검색 결과`,
    };
    return labels[f.type];
  });

  const pageDesc = computed(() => {
    const f = activeFilter.value;
    if (!f) return '검색어 또는 필터를 지정해 주세요.';
    const count = posts.value.length;
    if (f.type === 'series')
      return seriesInfo.value?.description || `시리즈에 포함된 ${count}개의 글`;
    if (f.type === 'category') return `카테고리에 포함된 ${count}개의 글`;
    if (f.type === 'tag') return `태그가 붙은 ${count}개의 글`;
    return `총 ${count}개의 글이 검색됐습니다.`;
  });

  function getFormattedDate(dateString: string | null) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function getCategory(post: PostItem) {
    if (!post.categories || post.categories.length === 0) return 'Uncategorized';
    return post.categories[0]?.name || 'Uncategorized';
  }
</script>

<template>
  <main class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
    <!-- 시리즈 히어로 썸네일 (series 필터 + 썸네일 있을 때만) -->
    <div
      v-if="activeFilter?.type === 'series' && seriesThumbnailUrl"
      class="mb-8 w-full overflow-hidden rounded-2xl shadow-md"
    >
      <img
        :src="seriesThumbnailUrl"
        :alt="seriesInfo?.name ?? ''"
        class="aspect-3/1 w-full object-cover"
      />
    </div>

    <!-- 헤더 -->
    <div class="mb-12">
      <div class="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Icon
          :name="
            activeFilter?.type === 'series'
              ? 'lucide:layers'
              : activeFilter?.type === 'category'
                ? 'lucide:folder'
                : activeFilter?.type === 'tag'
                  ? 'lucide:tag'
                  : 'lucide:search'
          "
          class="size-4"
        />
        <span class="tracking-widest uppercase">{{
          activeFilter?.type === 'series'
            ? 'Series'
            : activeFilter?.type === 'category'
              ? 'Category'
              : activeFilter?.type === 'tag'
                ? 'Tag'
                : 'Search'
        }}</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ pageTitle }}</h1>
      <p v-if="!pending" class="text-muted-foreground mt-3 text-lg">{{ pageDesc }}</p>
    </div>

    <!-- 로딩 -->
    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">게시글을 불러오는데 실패했습니다.</p>
      <p class="text-muted-foreground text-sm">{{ error.message }}</p>
    </div>

    <!-- 빈 결과 -->
    <div
      v-else-if="posts.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:search-x" class="text-muted-foreground mb-4 size-12" />
      <p class="text-muted-foreground text-lg">검색 결과가 없습니다.</p>
    </div>

    <!-- 리스트 -->
    <div v-else class="divide-border flex flex-col divide-y">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/posts/${post.postIdx}-${post.slug}`"
        class="group hover:bg-card relative flex flex-col sm:flex-row sm:justify-between"
      >
        <!-- 본문 정보 -->
        <div
          class="flex-1 p-4 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-linear-to-b before:from-sky-500 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100 sm:py-8"
        >
          <div
            class="text-muted-foreground mb-2 flex flex-col-reverse items-start text-sm sm:flex-row sm:items-center"
          >
            <span class="text-primary font-semibold">{{ getCategory(post) }}</span>
            <span class="ms-2 hidden sm:inline">·</span>
            <span class="ms-2 text-xs">{{ `No. ${post.postIdx}` }}</span>
            <!-- 시리즈 배지 (series 필터가 아닐 때만) -->
            <template
              v-if="activeFilter?.type !== 'series' && post.series && post.series.length > 0"
            >
              <span class="ms-2 hidden sm:inline">·</span>
              <span class="text-muted-foreground ms-2 flex items-center gap-1 text-xs">
                <Icon name="lucide:layers" class="size-3" />
                {{ post.series[0]?.name }}
              </span>
            </template>
          </div>
          <h3
            class="text-foreground group-hover:text-muted-foreground mb-2 text-xl font-bold tracking-tight transition-colors"
          >
            {{ post.title }}
          </h3>
          <p class="text-muted-foreground line-clamp-1 text-sm md:line-clamp-2">
            {{ post.summary || '' }}
          </p>
          <!-- 태그 -->
          <div v-if="post.tags && post.tags.length > 0" class="mt-3 flex flex-wrap gap-1">
            <span
              v-for="t in post.tags"
              :key="t.slug"
              class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
            >
              #{{ t.name }}
            </span>
          </div>
        </div>

        <!-- 날짜 -->
        <div class="text-muted-foreground flex items-center gap-1 p-4 sm:shrink-0">
          <Icon name="lucide:clock" class="text-muted-foreground mb-0.5 size-4" />
          <time :datetime="post.publishedAt || ''" class="text-sm">
            {{ getFormattedDate(post.publishedAt) }}
          </time>
        </div>
      </NuxtLink>
    </div>
  </main>
</template>
