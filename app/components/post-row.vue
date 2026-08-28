<script setup lang="ts">
  import type { PostItem } from '~~/shared/types';
  import { cn } from '~/utils/cn';
  import { formatPostDateYmd } from '~/utils/format-post-date';
  import { postPath } from '~/utils/post-helpers';

  const {
    post,
    showSeries = true,
    showTags = true,
  } = defineProps<{
    post: PostItem;
    /** 시리즈 목록에서는 모든 글이 같은 시리즈라 칩이 의미 없다 */
    showSeries?: boolean;
    showTags?: boolean;
  }>();

  // useNavFeedback은 호출마다 독립된 ref를 준다. 행마다 하나씩 두어도 동작이 같다.
  const { onNavigate, isPending } = useNavFeedback();

  const rowKey = computed(() => `post-${post.postIdx}`);
  const category = computed(() => post.categories?.[0] || 'Uncategorized');
  const seriesName = computed(() => post.series?.[0]);
</script>

<template>
  <NuxtLink
    :to="postPath(post)"
    :aria-busy="isPending(rowKey)"
    :class="
      cn(
        'group hover:bg-card relative flex flex-col transition-opacity sm:flex-row sm:justify-between',
        isPending(rowKey) && 'pointer-events-none opacity-60',
      )
    "
    @click="onNavigate(rowKey)"
  >
    <div
      class="flex-1 p-4 transition-all before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-linear-to-b before:from-sky-500 before:to-indigo-500 before:opacity-0 before:transition-opacity before:duration-200 group-hover:before:opacity-100 sm:py-8"
    >
      <div
        class="text-muted-foreground mb-2 flex flex-col-reverse items-start text-sm sm:flex-row sm:items-center"
      >
        <span class="text-primary font-semibold">{{ category }}</span>
        <span class="ms-2 hidden sm:inline">{{ '·' }}</span>
        <span class="ms-2 text-xs">{{ `No. ${post.postIdx}` }}</span>
        <template v-if="showSeries && seriesName">
          <span class="ms-2 hidden sm:inline">{{ '·' }}</span>
          <span class="text-muted-foreground ms-2 flex items-center gap-1 text-xs">
            <Icon name="lucide:layers" class="size-3" />
            {{ seriesName }}
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

      <div v-if="showTags && post.tags?.length" class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tagName in post.tags"
          :key="tagName"
          class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs"
        >
          {{ `#${tagName}` }}
        </span>
      </div>
    </div>

    <div class="text-muted-foreground flex items-center gap-1 p-4 sm:shrink-0">
      <Icon name="lucide:clock" class="text-muted-foreground mb-0.5 size-4" />
      <time :datetime="post.publishedAt || ''" class="text-sm">
        {{ formatPostDateYmd(post.publishedAt) }}
      </time>
    </div>
  </NuxtLink>
</template>
