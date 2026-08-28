<script setup lang="ts">
  import {
    ProseA,
    ProseBlockquote,
    ProseCode,
    ProseH2,
    ProseH3,
    ProseH4,
    ProseH5,
    ProseHr,
    ProseImg,
    ProseLi,
    ProseOl,
    ProseP,
    ProsePre,
    ProseTable,
    ProseTbody,
    ProseTd,
    ProseTh,
    ProseTr,
    ProseUl,
  } from '#components';
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

  /*
   * prose 컴포넌트를 태그별로 명시적으로 연결한다.
   *
   * comark의 resolveComponent는 getCurrentInstance()?.appContext?.components로
   * 전역 컴포넌트를 찾는데, 렌더 경로에서 그 인스턴스가 잡히지 않아
   * 21개 prose 컴포넌트가 하나도 적용되지 않고 본문이 comark 원시 출력로
   * 렌더되고 있었다(코드블록 복사 버튼·콜아웃·제목 앵커가 전부 미적용).
   * components prop으로 직접 넘기면 전역 조회에 의존하지 않는다.
   */
  const proseComponents = {
    a: ProseA,
    blockquote: ProseBlockquote,
    code: ProseCode,
    h2: ProseH2,
    h3: ProseH3,
    h4: ProseH4,
    h5: ProseH5,
    hr: ProseHr,
    img: ProseImg,
    li: ProseLi,
    ol: ProseOl,
    p: ProseP,
    pre: ProsePre,
    table: ProseTable,
    tbody: ProseTbody,
    td: ProseTd,
    th: ProseTh,
    tr: ProseTr,
    ul: ProseUl,
  };
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
      <MarkdownDocument v-if="tree" :value="tree" :components="proseComponents" />
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
