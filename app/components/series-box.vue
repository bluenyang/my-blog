<script setup lang="ts">
  import type { PostItem } from '~/types/post';

  interface SeriesBoxProps {
    seriesName: string;
    seriesPosts: PostItem[];
    currentPostIdx: number;
  }

  const { seriesName, seriesPosts: posts, currentPostIdx } = defineProps<SeriesBoxProps>();
  const { onNavigate, isPending } = useNavFeedback();
</script>

<template>
  <div class="border-border bg-block-bg mb-12 rounded-xl border p-6">
    <div class="text-muted-foreground font-jua mb-4 flex items-center text-sm">
      <Icon name="lucide:layers" class="mr-2 size-4" />
      <span>{{ '시리즈' }}</span>
      <span class="px-2">{{ '·' }}</span>
      <span>{{ seriesName }}</span>
      <span class="ml-2 text-sm font-normal">
        {{ `(${posts.length}개의 글)` }}
      </span>
    </div>
    <ul class="space-y-2 ps-4">
      <li v-for="(post, index) in posts" :key="post.id" class="flex items-start text-sm">
        <span class="text-muted-foreground font-jua mt-0.5 mr-4">{{ index + 1 }}.</span>
        <NuxtLink
          v-if="post.postIdx !== currentPostIdx"
          :to="`/posts/${post.postIdx}-${post.slug}`"
          prefetch-on="interaction"
          :aria-busy="isPending(`post-${post.id}`)"
          :class="
            cn(
              'text-muted-foreground hover:text-primary underline-offset-4 transition-all hover:underline',
              isPending(`post-${post.id}`) && 'pointer-events-none opacity-60',
            )
          "
          @click="onNavigate(`post-${post.id}`)"
        >
          {{ post.title }}
        </NuxtLink>
        <span v-else class="text-foreground flex w-full items-center justify-between">
          <span class="font-bold">
            {{ post.title }}
          </span>
          <span class="me-4">
            {{ '현재' }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
