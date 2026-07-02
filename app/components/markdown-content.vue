<script setup lang="ts">
  import type { MDCParserResult } from '@nuxtjs/mdc';

  import SeriesBox from '~/components/series-box.vue';
  import type { PostItem } from '~/types/post';

  interface MarkdownContentProps {
    postContent: MDCParserResult;
    postIdx: number;
    seriesId?: string;
    seriesName?: string;
    seriesPosts?: PostItem[];
    currentPostIdx?: number;
  }

  const { postContent, seriesId, seriesName, seriesPosts, currentPostIdx } =
    defineProps<MarkdownContentProps>();
</script>

<template>
  <!-- Main Layout -->
  <div class="relative mx-auto flex max-w-7xl flex-col items-start gap-12 lg:flex-row">
    <!-- Main Content -->
    <main class="w-full min-w-0 flex-1">
      <!-- 모바일 TOC -->
      <div class="mb-8 block lg:hidden">
        <details class="bg-card border-border rounded-xl border p-4 shadow-sm">
          <summary
            class="text-foreground flex cursor-pointer items-center justify-between font-bold"
          >
            목차 보기
            <Icon name="lucide:chevron-down" class="size-5" />
          </summary>
          <div class="mt-4">
            <TocLink v-if="postContent.toc" :links="postContent.toc.links" />
          </div>
        </details>
      </div>

      <!-- Series Box -->
      <SeriesBox
        v-if="seriesId && seriesName && currentPostIdx"
        :series-id="seriesId"
        :series-name="seriesName"
        :current-post-idx="currentPostIdx"
        :series-posts="seriesPosts"
      />

      <!-- Markdown Content -->
      <MDCRenderer v-if="postContent" :body="postContent.body" :data="postContent.data" />
    </main>
    <!-- Floating Nav (TOC) - Left Side -->
    <aside v-if="postContent" class="hidden w-64 shrink-0 lg:sticky lg:top-36 lg:block">
      <div class="flex flex-col text-sm">
        <div class="text-foreground mb-4 font-bold">{{ '목차' }}</div>
        <TocLink v-if="postContent.toc" :links="postContent.toc.links" />
      </div>
    </aside>
  </div>
</template>
