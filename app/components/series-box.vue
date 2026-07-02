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
  <div class="border-border bg-muted/30 my-8 rounded-xl border p-6">
    {{ error }}
    <div class="text-foreground mb-4 flex items-center text-lg font-bold">
      <Icon name="lucide:layers" class="text-primary mr-2 size-5" />
      {{ seriesName }}
      <span class="text-muted-foreground ml-2 text-sm font-normal">
        ({{ posts.length }}개의 글)
      </span>
    </div>
    <ul class="space-y-2">
      <li v-for="(post, index) in posts" :key="post.id" class="flex items-start text-sm">
        <span class="text-muted-foreground mt-0.5 mr-3 font-mono">{{ index + 1 }}.</span>
        <NuxtLink
          v-if="post.postIdx !== currentPostIdx"
          :to="`/posts/${post.postIdx}-${post.slug}`"
          class="text-muted-foreground hover:text-primary underline-offset-4 transition-colors hover:underline"
        >
          {{ post.title }}
        </NuxtLink>
        <span v-else class="text-foreground font-bold"> {{ post.title }} (현재 글) </span>
      </li>
    </ul>
  </div>
</template>
