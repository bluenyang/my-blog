<script setup lang="ts">
  import { useSearchPosts, type SearchPostsOptions } from '~/composables/use-post';
  import { useSeriesBySlug } from '~/composables/use-series';
  import type { PostItem } from '~/types/post';

  const props = defineProps<{
    filterType: 'category' | 'tag' | 'series' | 'search';
    filterValue: string;
  }>();

  const config = useRuntimeConfig();
  const { categories } = useCategory();
  const { tags } = useTag();
  const { onNavigate, isPending } = useNavFeedback();

  const searchOptions = computed<SearchPostsOptions>(() => {
    const value = props.filterValue;
    if (!value) return {};
    if (props.filterType === 'category') return { category: value };
    if (props.filterType === 'tag') return { tag: value };
    if (props.filterType === 'series') return { series: value };
    return { search: value };
  });

  const { posts, pending, error } = useSearchPosts(searchOptions);

  const seriesSlug = computed(() =>
    props.filterType === 'series' ? props.filterValue : undefined,
  );
  const { series: seriesInfo } = useSeriesBySlug(seriesSlug);

  const categoryInfo = computed(() => {
    if (props.filterType !== 'category' || !props.filterValue) return null;
    return findCategoryBySlug(categories.value, props.filterValue);
  });

  const tagInfo = computed(() => {
    if (props.filterType !== 'tag' || !props.filterValue) return null;
    return tags.value.find((tag) => tag.slug === props.filterValue) ?? null;
  });

  const seriesThumbnailUrl = computed(() => {
    if (!seriesInfo.value?.thumbnail) return null;
    return `${config.public.directusUrl}/assets/${seriesInfo.value.thumbnail}?width=1200&height=400&fit=cover`;
  });

  const eyebrow = computed(() => {
    const labels = {
      series: 'Series',
      category: 'Category',
      tag: 'Tag',
      search: 'Search',
    } as const;
    return labels[props.filterType];
  });

  const iconName = computed(() => {
    const icons = {
      series: 'lucide:layers',
      category: 'lucide:folder',
      tag: 'lucide:tag',
      search: 'lucide:search',
    } as const;
    return icons[props.filterType];
  });

  const pageTitle = computed(() => {
    if (props.filterType === 'series') return seriesInfo.value?.name ?? props.filterValue;
    if (props.filterType === 'category')
      return categoryInfo.value?.name
        ? `카테고리 · ${categoryInfo.value.name}`
        : `카테고리 · ${props.filterValue}`;
    if (props.filterType === 'tag')
      return tagInfo.value?.name ? `태그 · #${tagInfo.value.name}` : `태그 · #${props.filterValue}`;
    if (!props.filterValue) return '검색';
    return `"${props.filterValue}" 검색 결과`;
  });

  const pageDesc = computed(() => {
    const count = posts.value.length;
    if (props.filterType === 'series') {
      return seriesInfo.value?.description || `시리즈에 포함된 ${count}개의 글`;
    }
    if (props.filterType === 'category') return `카테고리에 포함된 ${count}개의 글`;
    if (props.filterType === 'tag') return `태그가 붙은 ${count}개의 글`;
    if (!props.filterValue) return '검색어를 입력해 주세요.';
    return `총 ${count}개의 글이 검색됐습니다.`;
  });

  useSeoMeta({
    title: pageTitle,
    description: pageDesc,
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
    <div
      v-if="filterType === 'series' && seriesThumbnailUrl"
      class="mb-8 w-full overflow-hidden rounded-2xl shadow-md"
    >
      <img
        :src="seriesThumbnailUrl"
        :alt="seriesInfo?.name ?? ''"
        class="aspect-3/1 w-full object-cover"
      />
    </div>

    <div class="mb-12">
      <div class="text-muted-foreground mb-3 flex items-center gap-2 text-sm">
        <Icon :name="iconName" class="size-4" />
        <span class="tracking-widest uppercase">{{ eyebrow }}</span>
      </div>
      <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">{{ pageTitle }}</h1>
      <p v-if="!pending" class="text-muted-foreground mt-3 text-lg">{{ pageDesc }}</p>
    </div>

    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">게시글을 불러오는데 실패했습니다.</p>
      <p class="text-muted-foreground text-sm">{{ error.message }}</p>
    </div>

    <div
      v-else-if="posts.length === 0"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:search-x" class="text-muted-foreground mb-4 size-12" />
      <p class="text-muted-foreground text-lg">
        {{ filterType === 'search' ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.' }}
      </p>
    </div>

    <div v-else class="divide-border flex flex-col divide-y">
      <NuxtLink
        v-for="post in posts"
        :key="post.id"
        :to="`/posts/${post.postIdx}-${post.slug}`"
        prefetch-on="interaction"
        :aria-busy="isPending(`post-${post.id}`)"
        :class="
          cn(
            'group hover:bg-card relative flex flex-col transition-opacity sm:flex-row sm:justify-between',
            isPending(`post-${post.id}`) && 'pointer-events-none opacity-60',
          )
        "
        @click="onNavigate(`post-${post.id}`)"
      >
        <div
          class="flex-1 p-4 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-linear-to-b before:from-sky-500 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100 sm:py-8"
        >
          <div
            class="text-muted-foreground mb-2 flex flex-col-reverse items-start text-sm sm:flex-row sm:items-center"
          >
            <span class="text-primary font-semibold">{{ getCategory(post) }}</span>
            <span class="ms-2 hidden sm:inline">·</span>
            <span class="ms-2 text-xs">{{ `No. ${post.postIdx}` }}</span>
            <template v-if="filterType !== 'series' && post.series && post.series.length > 0">
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
