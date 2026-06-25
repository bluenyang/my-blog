<script setup lang="ts">
  import type { CategoryItem } from '~/types/category';

  interface MenuItemProps {
    items: CategoryItem[];
    total: number;
  }

  const { items, total } = defineProps<MenuItemProps>();
</script>

<template>
  <ul class="w-full min-w-2xl transition-colors duration-500">
    <li class="relative flex w-full flex-col gap-2 transition-colors duration-500">
      <NuxtLink
        :to="`/posts`"
        class="flex w-full items-center justify-center gap-4 rounded-lg border border-transparent bg-linear-to-r bg-clip-text py-2 text-center text-lg font-bold text-transparent transition-colors duration-200 ease-in-out hover:border-gray-300 hover:from-blue-600 hover:to-purple-700 dark:from-gray-50 dark:to-gray-50 dark:hover:border-gray-600 dark:hover:from-blue-300 dark:hover:to-purple-400"
      >
        <Icon name="lucide:pencil" class="size-5 text-sky-600" />
        <span class="font-medium">{{ '전체 글' }}</span>
        <span
          class="bg-muted-foreground text-foreground ml-2 inline-flex items-center gap-1 rounded-full px-2.5 text-base font-bold"
        >
          {{ total || 0 }}
        </span>
      </NuxtLink>
    </li>
    <li class="relative flex w-full flex-col gap-2 transition-colors duration-500">
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
