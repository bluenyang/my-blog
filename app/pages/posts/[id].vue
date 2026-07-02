<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  import MarkdownContent from '~/components/markdown-content.vue';
  import { usePostDetail, useSeriesPosts } from '~/composables/use-post';

  const route = useRoute();
  const idParam = route.params.id as string;
  const postIdx = parseInt(idParam, 10);

  const { post, pending, error } = usePostDetail(postIdx);

  const config = useRuntimeConfig();

  const thumbnailUrl = computed(() => {
    if (post.value?.thumbnail) {
      return `${config.public.directusUrl}/assets/${post.value.thumbnail}?width=1200&height=630&fit=cover`;
    }
    return null;
  });

  const seriesName = computed(() => {
    if (post.value?.series && post.value.series.length > 0) {
      return post.value.series[0]?.name;
    }
    return undefined;
  });

  const seriesId = computed(() => {
    if (post.value?.series && post.value.series.length > 0) {
      return post.value.series[0]?.id;
    }
    return undefined;
  });

  const { posts: seriesPosts } = useSeriesPosts(seriesId);

  const seriesOrder = computed(() => {
    if (!seriesPosts.value.length || !post.value) return null;
    const index = seriesPosts.value.findIndex((p) => p.postIdx === post.value?.postIdx);
    return index >= 0 ? index + 1 : null;
  });

  const formattedDate = computed(() => {
    if (!post.value?.publishedAt) return '';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }).format(new Date(post.value.publishedAt));
  });

  const categoryName = computed(() => {
    if (post.value?.categories && post.value.categories.length > 0) {
      return post.value.categories[0]?.name || 'Uncategorized';
    }
    return 'Uncategorized';
  });

  const authorInfo = computed(() => {
    const author = post.value?.author;
    if (!author) return { name: 'Unknown', avatar: null };
    const name =
      author.nickname || `${author.lastName || ''}${author.firstName || ''}`.trim() || 'Author';
    let avatarUrl = null;
    if (author.avatar) {
      avatarUrl = `${config.public.directusUrl}/assets/${author.avatar}?width=100&height=100&fit=cover`;
    }
    return { name, avatarUrl };
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

    <div v-else class="ms-auto max-w-6xl space-y-8">
      <!-- Hero Section -->
      <div class="flex flex-col items-start text-center">
        <!-- Thumbnail -->
        <div
          v-if="thumbnailUrl"
          class="mb-8 w-full max-w-4xl overflow-hidden rounded-2xl shadow-lg"
        >
          <img :src="thumbnailUrl" :alt="post.title" class="aspect-2/1 w-full object-cover" />
        </div>

        <div class="flex flex-col">
          <div class="mb-4 flex flex-wrap items-center justify-start gap-2 text-sm">
            <span class="text-muted-foreground font-bold">{{ categoryName }}</span>
            <template v-if="seriesName && seriesOrder">
              <span class="text-muted-foreground">{{ '·' }}</span>
              <NuxtLink
                :to="`/search?series=${post.series![0]?.slug}`"
                class="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon name="lucide:layers" class="mr-1 mb-0.5 inline size-4" />
                {{ `${seriesName} (${seriesOrder}편)` }}
              </NuxtLink>
            </template>
          </div>

          <h1 class="mb-6 text-start text-3xl leading-tight font-bold sm:text-5xl">
            {{ post.title }}
          </h1>

          <div class="text-muted-foreground mb-6 flex items-center justify-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <img
                v-if="authorInfo.avatarUrl"
                :src="authorInfo.avatarUrl"
                alt="Author Avatar"
                class="size-6 rounded-full"
              />
              <div
                v-else
                class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-full"
              >
                <Icon name="lucide:user" class="size-4" />
              </div>
              <span class="text-foreground font-medium">{{ authorInfo.name }}</span>
            </div>
            <span>·</span>
            <time :datetime="post.publishedAt || ''">{{ formattedDate }}</time>
          </div>
        </div>

        <div
          v-if="post.tags && post.tags.length > 0"
          class="flex flex-wrap items-center justify-center gap-2"
        >
          <span
            v-for="tag in post.tags"
            :key="tag.slug"
            class="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
          >
            {{ `# ${tag.name}` }}
          </span>
        </div>
      </div>

      <MarkdownContent
        v-if="post.content"
        :post-content="post.content"
        :post-idx="post.postIdx"
        :series-id="seriesId"
        :series-name="seriesName"
        :series-posts="seriesPosts"
        :current-post-idx="post.postIdx"
      />
    </div>
  </div>
</template>
