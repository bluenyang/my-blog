<script setup lang="ts">
  import type { MarkdownDocument } from 'comark';
  import type { TocLink } from '~/components/toc-link.vue';

  interface MarkdownContentProps {
    /** 파싱은 페이지에서 usePostContent로 한 번만 한다 (SSR payload 재사용) */
    tree: MarkdownDocument | null;
    toc: TocLink[];
    activeId?: string;
    series?: SeriesItemInPost;
    currentPostIdx: number;
  }

  const { tree, toc, activeId, series, currentPostIdx } = defineProps<MarkdownContentProps>();
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
            <TocLink v-if="toc.length" :links="toc" :active-id="activeId" />
          </div>
        </details>
      </div>

      <!-- Series Box -->
      <SeriesBox
        v-if="series && currentPostIdx"
        :series="series"
        :current-post-idx="currentPostIdx"
      />

      <!-- Markdown Content -->
      <MarkdownDocument v-if="tree" :value="tree" />
    </main>
    <!-- Floating Nav (TOC) - Left Side -->
    <aside v-if="toc.length" class="hidden w-52 shrink-0 rounded-md lg:sticky lg:top-36 lg:block">
      <div class="flex flex-col text-sm">
        <div class="text-foreground mb-2 text-base font-semibold">{{ '목차' }}</div>
        <TocLink v-if="toc.length" :links="toc" :active-id="activeId" class="space-y-4" />
      </div>
    </aside>
  </div>
</template>
