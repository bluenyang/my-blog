<script setup lang="ts">
  import BannerHero from '~/components/banner-hero.vue';
  import PostCard from '~/components/post-card.vue';
  import { useRecentPosts } from '~/composables/use-post';

  const { posts, pending, error } = useRecentPosts(6);
</script>

<template>
  <div class="w-full">
    <BannerHero />

    <!-- 최신 글 섹션 -->
    <section class="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div class="mb-12 flex items-end justify-between">
        <div>
          <h2
            class="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white"
          >
            최신 글
          </h2>
          <p class="mt-3 text-lg text-gray-500 dark:text-gray-400">
            블로그에 새롭게 올라온 이야기를 만나보세요.
          </p>
        </div>
        <NuxtLink
          to="/posts"
          class="hidden text-sm font-semibold text-sky-600 hover:text-sky-500 sm:flex sm:items-center dark:text-sky-400 dark:hover:text-sky-300"
        >
          전체 보기 <Icon name="lucide:arrow-right" class="ml-1 size-4" />
        </NuxtLink>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="pending" class="flex justify-center py-24">
        <Icon name="lucide:loader-2" class="size-10 animate-spin text-sky-500" />
      </div>

      <!-- 에러 상태 -->
      <div v-else-if="error" class="flex flex-col items-center justify-center py-24 text-center">
        <Icon name="lucide:alert-circle" class="mb-4 size-12 text-red-500" />
        <p class="text-lg text-red-500">게시글을 불러오는데 실패했습니다.</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ error.message }}</p>
      </div>

      <!-- 빈 목록 상태 -->
      <div
        v-else-if="posts.length === 0"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <Icon name="lucide:file-text" class="mb-4 size-12 text-gray-400" />
        <p class="text-lg text-gray-500 dark:text-gray-400">등록된 게시글이 없습니다.</p>
      </div>

      <!-- 게시글 그리드 -->
      <div
        v-else
        class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8"
      >
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <!-- 모바일 전체 보기 버튼 -->
      <div class="mt-10 sm:hidden">
        <NuxtLink
          to="/posts"
          class="flex w-full items-center justify-center rounded-lg bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        >
          전체 보기
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
