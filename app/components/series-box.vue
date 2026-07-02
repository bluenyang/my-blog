<script setup lang="ts">
  import { useSeriesPosts } from '~/composables/use-post';

  const props = defineProps<{
    seriesId: string;
    seriesName: string;
    currentPostIdx: number;
  }>();

  const { posts, error } = useSeriesPosts(props.seriesId);
</script>

<template>
  <div class="border-border bg-block-bg mb-12 rounded-xl border p-6">
    {{ error }}
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
          class="text-muted-foreground hover:text-primary underline-offset-4 transition-colors hover:underline"
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
