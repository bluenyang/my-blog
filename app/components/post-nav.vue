<script setup lang="ts">
  import type { PostLink } from '~~/shared/types';
  import { postPath } from '~/utils/post-helpers';

  defineProps<{
    prev?: PostLink | null;
    next?: PostLink | null;
  }>();
</script>

<template>
  <nav v-if="prev || next" aria-label="이전 다음 글" class="mt-12 grid gap-4 sm:grid-cols-2">
    <NuxtLink
      v-if="prev"
      :to="postPath(prev)"
      class="bg-card border-border hover:border-primary group flex flex-col gap-1 rounded-xl border p-4 transition-colors"
    >
      <span class="text-muted-foreground flex items-center gap-1 text-xs">
        <Icon name="lucide:arrow-left" class="size-3.5" />
        {{ '이전 글' }}
      </span>
      <span class="group-hover:text-primary line-clamp-2 font-semibold transition-colors">
        {{ prev.title }}
      </span>
    </NuxtLink>
    <div v-else class="hidden sm:block" />

    <NuxtLink
      v-if="next"
      :to="postPath(next)"
      class="bg-card border-border hover:border-primary group flex flex-col gap-1 rounded-xl border p-4 text-right transition-colors"
    >
      <span class="text-muted-foreground flex items-center justify-end gap-1 text-xs">
        {{ '다음 글' }}
        <Icon name="lucide:arrow-right" class="size-3.5" />
      </span>
      <span class="group-hover:text-primary line-clamp-2 font-semibold transition-colors">
        {{ next.title }}
      </span>
    </NuxtLink>
  </nav>
</template>
