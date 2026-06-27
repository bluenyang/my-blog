<script setup lang="ts">
  import type { PostItem } from '~/types/post';

  const props = defineProps<{ post: PostItem }>();
  const config = useRuntimeConfig();

  const thumbnailUrl = computed(() => {
    if (props.post.thumbnail) {
      return `${config.public.directusUrl}/assets/${props.post.thumbnail}?width=600&height=400&fit=cover`;
    }
    return null;
  });

  const formattedDate = computed(() => {
    if (!props.post.publishedAt) return '';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(props.post.publishedAt));
  });

  const categories = computed(() => {
    if (!props.post.categories) return [];
    return props.post.categories
      .map((c) => c.categories_id?.name)
      .filter((name): name is string => !!name);
  });
</script>

<template>
  <NuxtLink
    :to="`/posts/${post.postIdx}-${post.slug}`"
    class="bg-card text-card-foreground group flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:shadow-none dark:hover:shadow-sky-900/20"
  >
    <!-- Thumbnail Area -->
    <div class="relative h-52 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        v-if="thumbnailUrl"
        :src="thumbnailUrl"
        :alt="post.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-linear-to-br from-blue-100 to-purple-200 dark:from-blue-900/50 dark:to-purple-900/50"
      >
        <Icon name="lucide:image" class="size-12 text-gray-400 opacity-50 dark:text-gray-500" />
      </div>

      <!-- Category Badge overlay -->
      <div v-if="categories.length > 0" class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span
          v-for="cat in categories"
          :key="cat"
          class="bg-background/90 text-foreground rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs backdrop-blur-md"
        >
          {{ cat }}
        </span>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex flex-1 flex-col p-6">
      <div class="mb-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <time :datetime="post.publishedAt || ''">{{ formattedDate }}</time>
      </div>

      <h3
        class="mb-3 line-clamp-2 text-xl leading-snug font-bold tracking-tight transition-colors group-hover:text-sky-600 dark:group-hover:text-sky-400"
      >
        {{ post.title }}
      </h3>

      <p class="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {{ post.summary || post.excerpt || '' }}
      </p>

      <!-- Footer -->
      <div class="mt-auto flex items-center font-semibold text-sky-600 dark:text-sky-400">
        <span class="text-sm">자세히 보기</span>
        <Icon
          name="lucide:arrow-right"
          class="ml-1.5 size-4 transition-transform group-hover:translate-x-1"
        />
      </div>
    </div>
  </NuxtLink>
</template>
