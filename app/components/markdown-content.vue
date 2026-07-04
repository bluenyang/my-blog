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
  <div
    class="relative mx-auto flex max-w-7xl flex-col items-start space-y-12 space-x-8 lg:flex-row"
  >
    <!-- Main Content -->
    <main class="w-full min-w-0 flex-1 space-y-8">
      <!-- 모바일 TOC -->
      <div class="mb-8 block lg:hidden">
        <details class="bg-card border-border rounded-xl border p-4 shadow-sm">
          <summary
            class="text-foreground flex cursor-pointer items-center justify-between font-bold"
          >
            {{ '목차 보기' }}
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
        :series-posts="seriesPosts!"
      />

      <!-- Markdown Content -->
      <MDCRenderer
        v-if="postContent"
        class="mdc-content"
        :body="postContent.body"
        :data="postContent.data"
      />
    </main>
    <!-- Floating Nav (TOC) - Left Side -->
    <aside v-if="postContent" class="hidden w-52 shrink-0 rounded-md lg:sticky lg:top-36 lg:block">
      <div class="flex flex-col text-sm">
        <div class="text-foreground mb-2 text-base font-semibold">{{ '목차' }}</div>
        <TocLink v-if="postContent.toc" :links="postContent.toc.links" class="space-y-4" />
      </div>
    </aside>
  </div>
</template>

<style lang="css">
  @reference "~/assets/css/main.css";

  .mdc-content :where(p) {
    @apply my-2 leading-relaxed;
  }

  .mdc-content :where(ul) {
    @apply my-2 ml-6 list-disc;
  }

  .mdc-content :where(ol) {
    @apply my-2 ml-6 list-decimal;
  }

  .mdc-content :where(li) {
    @apply my-2;
  }

  .mdc-content :where(strong) {
    @apply font-bold;
  }

  .mdc-content :where(em) {
    @apply italic;
  }

  .mdc-content > p > a {
    @apply text-primary underline;
  }
</style>
