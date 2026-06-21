<script setup lang="ts">
  import type { CategoryItem } from '~/types/category';

  interface MenuItemProps {
    items: CategoryItem[];
  }

  const { items } = defineProps<MenuItemProps>();
</script>

<template>
  <ul class="w-full min-w-2xl text-gray-800 transition-colors duration-500 dark:text-gray-50">
    <li
      class="relative flex w-full flex-col gap-2 bg-white transition-colors duration-500 dark:bg-gray-800"
    >
      <NuxtLink
        :to="`/posts`"
        class="flex w-full items-center justify-center gap-4 rounded-lg border border-transparent bg-linear-to-r from-gray-800 to-gray-800 bg-clip-text py-2 text-center text-lg font-bold text-transparent transition-colors duration-200 ease-in-out hover:border-gray-300 hover:from-blue-600 hover:to-purple-700 dark:from-gray-50 dark:to-gray-50 dark:hover:border-gray-600 dark:hover:from-blue-300 dark:hover:to-purple-400"
      >
        <Icon name="ph:note-pencil-light" class="size-5 text-sky-600" />
        <span class="font-medium">{{ '전체 글' }}</span>
      </NuxtLink>
    </li>
    <li
      class="relative flex w-full flex-col gap-2 bg-white transition-colors duration-500 dark:bg-gray-800"
    >
      <ul
        class="mt-2 grid gap-x-4 gap-y-4"
        :class="
          cn(
            items.length === 1 ? 'grid-cols-1' : items.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
          )
        "
      >
        <CategoryDropdownItem :items="items" />
      </ul>
    </li>
  </ul>
</template>
