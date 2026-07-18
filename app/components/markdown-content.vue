<script setup lang="ts">
  // import type { MDCParserResult } from '@nuxtjs/mdc';
  import type { ComarkTree } from 'comark';
  import highlight from '@comark/nuxt/plugins/highlight';
  import oneDarkPro from '@shikijs/themes/one-dark-pro';

  interface MarkdownContentProps {
    postContent: string;
    postIdx: number;
    series?: SeriesItemInPost;
    currentPostIdx: number;
  }

  const { postContent, series, currentPostIdx } = defineProps<MarkdownContentProps>();

  const content = ref<ComarkTree | null>(null);

  const plugins = [
    highlight({
      themes: {
        light: oneDarkPro,
        dark: oneDarkPro,
      },
    }),
  ];

  onMounted(async () => {
    if (!postContent) {
      return;
    }
    content.value = await parseContent(postContent);
  });
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
            <TocLink v-if="content?.meta.toc" :links="content?.meta.toc.links" />
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
      <!-- <MDCRenderer v-if="content" class="mdc-content" :body="content?.body" :data="content?.data" /> -->
      <Comark v-if="content" :tree="content" :plugins="plugins" />
    </main>
    <!-- Floating Nav (TOC) - Left Side -->
    <aside v-if="postContent" class="hidden w-52 shrink-0 rounded-md lg:sticky lg:top-36 lg:block">
      <div class="flex flex-col text-sm">
        <div class="text-foreground mb-2 text-base font-semibold">{{ '목차' }}</div>
        <TocLink v-if="content?.meta.toc" :links="content?.meta.toc.links" class="space-y-4" />
      </div>
    </aside>
  </div>
</template>
