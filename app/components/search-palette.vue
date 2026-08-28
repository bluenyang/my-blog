<script setup lang="ts">
  import { refDebounced } from '@vueuse/core';

  import { cn } from '~/utils/cn';
  import { postPath } from '~/utils/post-helpers';

  const { isOpen, close, open } = useSearchPalette();

  // ⌘K / Ctrl+K 전역 단축키. 팔레트는 항상 마운트되어 있으므로 여기서 듣는다.
  function onGlobalKeydown(event: KeyboardEvent) {
    if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    if (isOpen.value) close();
    else open();
  }

  onMounted(() => document.addEventListener('keydown', onGlobalKeydown));
  onBeforeUnmount(() => document.removeEventListener('keydown', onGlobalKeydown));
  const { sidebar } = useSidebar();
  const router = useRouter();

  const term = ref('');
  const debouncedTerm = refDebounced(term, 300);
  const { results, pending } = usePostSearch(debouncedTerm);

  const inputEl = ref<HTMLInputElement | null>(null);
  const listEl = ref<HTMLElement | null>(null);
  const activeIndex = ref(0);

  // 템플릿에서 쓰려면 setup 스코프 바인딩이 필요하다
  const minLength = SEARCH_MIN_LENGTH;

  const normalizedTerm = computed(() => debouncedTerm.value.trim().toLowerCase());
  const hasQuery = computed(() => normalizedTerm.value.length >= SEARCH_MIN_LENGTH);

  // 태그·시리즈는 이미 받아둔 사이드바 데이터로 거른다 — 추가 요청이 없다
  const matchedTags = computed(() => {
    if (!hasQuery.value) return [];
    return (sidebar.value?.tags.items ?? [])
      .filter((tag) => tag.name.toLowerCase().includes(normalizedTerm.value))
      .slice(0, 4);
  });

  const matchedSeries = computed(() => {
    if (!hasQuery.value) return [];
    return (sidebar.value?.series.items ?? [])
      .filter((item) => item.name.toLowerCase().includes(normalizedTerm.value))
      .slice(0, 3);
  });

  interface Row {
    key: string;
    kind: 'post' | 'tag' | 'series';
    label: string;
    meta?: string;
    thumbnail?: string | null;
    to: string;
  }

  const rows = computed<Row[]>(() => [
    ...results.value.map((hit) => ({
      key: `post-${hit.postIdx}`,
      kind: 'post' as const,
      label: hit.title,
      meta: [hit.category, formatPostDateYmd(hit.publishedAt)].filter(Boolean).join(' · '),
      thumbnail: hit.thumbnail,
      to: postPath(hit),
    })),
    ...matchedSeries.value.map((item) => ({
      key: `series-${item.slug}`,
      kind: 'series' as const,
      label: item.name,
      meta: `시리즈 · ${item.postCount ?? 0}개의 글`,
      to: `/series/${encodeURIComponent(item.slug)}`,
    })),
    ...matchedTags.value.map((tag) => ({
      key: `tag-${tag.slug}`,
      kind: 'tag' as const,
      label: tag.name,
      meta: `태그 · ${tag.postCount ?? 0}개의 글`,
      to: `/tags/${encodeURIComponent(tag.slug)}`,
    })),
  ]);

  watch(rows, () => {
    activeIndex.value = 0;
  });

  const { lock } = useBodyScrollLock('search-palette');

  watch(isOpen, async (open) => {
    lock(open);
    if (open) {
      term.value = '';
      activeIndex.value = 0;
      await nextTick();
      inputEl.value?.focus();
    }
  });

  function move(delta: number) {
    if (!rows.value.length) return;
    const next = (activeIndex.value + delta + rows.value.length) % rows.value.length;
    activeIndex.value = next;
    nextTick(() => {
      listEl.value
        ?.querySelector<HTMLElement>(`[data-index="${next}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  function go(row: Row | undefined, newTab = false) {
    if (!row) return;
    if (newTab) {
      window.open(row.to, '_blank', 'noopener');
      return;
    }
    close();
    router.push(row.to);
  }

  function onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        move(-1);
        break;
      case 'Enter':
        event.preventDefault();
        go(rows.value[activeIndex.value], event.metaKey || event.ctrlKey);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
    }
  }

  function seeAll() {
    const query = term.value.trim();
    close();
    router.push(query ? `/search?search=${encodeURIComponent(query)}` : '/search');
  }

  function iconFor(kind: Row['kind']) {
    if (kind === 'series') return 'lucide:layers';
    if (kind === 'tag') return 'lucide:tag';
    return 'lucide:file-text';
  }
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-150"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-100 flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-label="검색"
        @click.self="close"
      >
        <div
          class="bg-popover border-border flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border shadow-2xl"
          @keydown="onKeydown"
        >
          <div class="border-border flex items-center gap-3 border-b px-4 py-3">
            <Icon name="lucide:search" class="text-muted-foreground size-5 shrink-0" />
            <input
              ref="inputEl"
              v-model="term"
              type="search"
              placeholder="글, 시리즈, 태그 검색…"
              aria-label="검색어"
              class="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-base outline-none"
            />
            <kbd
              class="text-muted-foreground border-border hidden rounded border px-1.5 py-0.5 text-[11px] sm:block"
            >
              Esc
            </kbd>
          </div>

          <div ref="listEl" class="min-h-0 flex-1 scrollbar-thin overflow-y-auto p-2">
            <p v-if="!hasQuery" class="text-muted-foreground px-3 py-8 text-center text-sm">
              {{ `${minLength}글자 이상 입력해 주세요.` }}
            </p>

            <p
              v-else-if="pending && !rows.length"
              class="text-muted-foreground px-3 py-8 text-center text-sm"
            >
              {{ '검색 중…' }}
            </p>

            <p v-else-if="!rows.length" class="text-muted-foreground px-3 py-8 text-center text-sm">
              {{ '검색 결과가 없습니다.' }}
            </p>

            <ul v-else class="space-y-1">
              <li v-for="(row, index) in rows" :key="row.key">
                <button
                  type="button"
                  :data-index="index"
                  :aria-selected="index === activeIndex"
                  :class="
                    cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                      index === activeIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted',
                    )
                  "
                  @click="go(row)"
                  @mouseenter="activeIndex = index"
                >
                  <img
                    v-if="row.thumbnail"
                    :src="row.thumbnail"
                    alt=""
                    width="40"
                    height="40"
                    loading="lazy"
                    decoding="async"
                    class="size-10 shrink-0 rounded object-cover"
                  />
                  <Icon v-else :name="iconFor(row.kind)" class="size-5 shrink-0 opacity-70" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate font-medium">{{ row.label }}</span>
                    <span
                      v-if="row.meta"
                      :class="
                        cn(
                          'block truncate text-xs',
                          index === activeIndex
                            ? 'text-primary-foreground/80'
                            : 'text-muted-foreground',
                        )
                      "
                    >
                      {{ row.meta }}
                    </span>
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <button
            v-if="hasQuery"
            type="button"
            class="border-border text-muted-foreground hover:text-foreground border-t px-4 py-2.5 text-left text-sm transition-colors"
            @click="seeAll"
          >
            {{ '전체 검색 결과 보기 →' }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
