<script setup lang="ts">
  import type { NuxtError } from '#app';

  const { error } = defineProps<{ error: NuxtError }>();

  const isNotFound = computed(() => error.statusCode === 404);

  const heading = computed(() =>
    isNotFound.value ? '페이지를 찾을 수 없습니다' : '문제가 발생했습니다',
  );

  const detail = computed(() =>
    isNotFound.value
      ? '주소가 바뀌었거나 삭제된 글일 수 있습니다.'
      : '잠시 후 다시 시도해 주세요. 문제가 계속되면 알려주세요.',
  );

  useHead({
    title: () => `${error.statusCode} ${isNotFound.value ? 'Not Found' : 'Error'}`,
    meta: [{ name: 'robots', content: 'noindex, follow' }],
  });

  function goHome() {
    clearError({ redirect: '/' });
  }
</script>

<template>
  <div
    class="bg-background text-foreground flex min-h-screen flex-col items-center justify-center px-6 text-center"
  >
    <Icon
      :name="isNotFound ? 'lucide:file-question' : 'lucide:alert-triangle'"
      :class="isNotFound ? 'text-muted-foreground size-14' : 'text-destructive size-14'"
    />

    <p class="text-muted-foreground mt-6 font-mono text-sm tracking-widest">
      {{ error.statusCode }}
    </p>

    <h1 class="mt-2 text-2xl font-bold sm:text-3xl">{{ heading }}</h1>

    <p class="text-muted-foreground mt-3 max-w-md text-sm sm:text-base">{{ detail }}</p>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
      <button
        class="bg-primary text-primary-foreground rounded-lg px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        @click="goHome"
      >
        홈으로
      </button>
      <NuxtLink
        to="/posts"
        class="border-border text-foreground hover:bg-muted rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors"
      >
        전체 글 보기
      </NuxtLink>
    </div>
  </div>
</template>
