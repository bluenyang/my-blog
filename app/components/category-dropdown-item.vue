<script setup lang="ts">
  import type { CategoryItem } from '~/types/category';

  interface MenuItemProps {
    items: CategoryItem[];
  }

  const { items } = defineProps<MenuItemProps>();
</script>

<template>
  <li v-for="item of items" :key="item.id" class="mb-auto grid text-center">
    <div
      v-if="item.children && item.children.length > 0"
      class="w-full cursor-default hover:[&>.accordion-body]:grid-rows-[1fr] hover:[&>.accordion-body_ul]:opacity-100"
    >
      <NuxtLink :to="`/categories/${item.slug}`" class="flex items-center gap-2">
        <Icon v-if="item.icon" :name="item.icon" class="size-5 text-sky-600" />
        <span
          class="flex w-full rounded-lg border border-transparent bg-linear-to-r from-gray-800 to-gray-800 bg-clip-text py-2 text-center text-transparent transition-colors duration-200 ease-in-out hover:from-blue-600 hover:to-purple-700 dark:from-gray-50 dark:to-gray-50 dark:hover:from-blue-300 dark:hover:to-purple-400"
          :class="cn(item.parent_id ? 'text-sm font-medium' : 'text-lg font-bold')"
        >
          {{ item.name }}
        </span>
      </NuxtLink>
      <div class="accordion-body grid grid-rows-[0fr] transition-all duration-300 ease-in-out">
        <div class="border-muted-foreground min-h-0 overflow-hidden border-l pl-4">
          <CategoryDropdownItem :items="item.children" />
        </div>
      </div>
    </div>
    <NuxtLink v-else :to="`/categories/${item.slug}`" class="flex items-center gap-2">
      <Icon v-if="item.icon" :name="item.icon" class="size-5 text-sky-600" />
      <span
        class="flex w-full rounded-lg border border-transparent bg-linear-to-r from-gray-800 to-gray-800 bg-clip-text py-2 text-center text-sm font-medium text-transparent transition-colors duration-200 ease-in-out hover:from-blue-600 hover:to-purple-700 dark:from-gray-50 dark:to-gray-50 dark:hover:from-blue-300 dark:hover:to-purple-400"
      >
        {{ item.name }}
      </span>
    </NuxtLink>
  </li>
</template>
