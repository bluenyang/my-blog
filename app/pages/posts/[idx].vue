<script setup lang="ts">
  const route = useRoute();
  const config = useRuntimeConfig();

  const idxParam = route.params.idx as string;
  const postIdx = parseInt(idxParam, 10);

  const { post, pending, error } = usePostDetail(postIdx);
  const series = computed(() => post.value?.series?.[0]);
  const seriesName = computed(() => series.value?.name);

  const seriesOrder = computed(() => {
    if (!series.value || !post.value?.postIdx) return null;
    const index = series.value.posts.findIndex((p) => p.postIdx === post.value?.postIdx);
    return index >= 0 ? index + 1 : null;
  });

  const formattedDate = computed(() => {
    if (!post.value?.publishedAt) return '';
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(post.value.publishedAt));
  });

  const categoryName = computed<string>(() => {
    if (!post.value?.categories?.length) {
      return 'Uncategorized';
    }
    return post.value.categories[0]?.name ?? 'Uncategorized';
  });

  function goBack() {
    window.history.back();
  }

  useSeoMeta({
    title: () => post.value?.title || 'Post',
    titleTemplate: `%s · BlueNyang's Devlog`,
    description: () => post.value?.summary || '',
    ogTitle: () => post.value?.title || 'Post',
    ogImage: () => post.value?.thumbnail || '',
    ogDescription: () => post.value?.summary || '',
    ogUrl: () => `${config.public.blogUrl}/posts/${post.value?.postIdx}-${post.value?.slug}`,
  });
</script>

<template>
  <div class="w-full px-4 py-32 sm:px-6 lg:px-8">
    <div v-if="pending" class="flex justify-center py-24">
      <Icon name="lucide:loader-2" class="text-primary size-10 animate-spin" />
    </div>

    <div
      v-else-if="error || !post"
      class="flex flex-col items-center justify-center py-24 text-center"
    >
      <Icon name="lucide:alert-circle" class="text-destructive mb-4 size-12" />
      <p class="text-destructive text-lg">{{ '게시글을 찾을 수 없습니다.' }}</p>
    </div>

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
          <img :src="post.thumbnail" :alt="post.title" class="aspect-2/1 w-full object-cover" />
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
                  prefetch-on="interaction"
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

          <div class="text-muted-foreground mb-6 flex items-center justify-start gap-2 text-sm">
            <div class="flex items-center gap-2">
              <img
                v-if="post.author.avatar"
                :src="post.author.avatar"
                alt="Author Avatar"
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
            prefetch-on="interaction"
            class="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
          >
            {{ `# ${tag.name}` }}
          </NuxtLink>
        </div>
      </div>

      <MarkdownContent
        v-if="post"
        :post-content="post.content"
        :post-idx="post.postIdx"
        :series="series"
        :current-post-idx="post.postIdx"
      />
    </div>
  </div>
</template>
