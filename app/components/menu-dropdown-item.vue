<script setup lang="ts">
  import type { NavigationItem } from '~/types/header';

  interface MenuItemProps {
    items: NavigationItem[];
  }

  const { items } = defineProps<MenuItemProps>();
</script>

<template>
  <ul class="space-y-2">
    <li v-for="item of items" :key="item.id" class="flex list-none items-center">
      <div
        v-if="item.children && item.children.length > 0"
        :href="item.url"
        class="w-full cursor-pointer hover:[&>.accordion-body]:grid-rows-[1fr] hover:[&>.accordion-body_ul]:opacity-100"
      >
        <div
          class="flex items-center gap-3 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <Icon v-if="item.icon" :name="item.icon" class="size-5 text-sky-600" />
          <span class="text-sm font-medium">{{ item.label }}</span>
        </div>
        <div class="accordion-body grid grid-rows-[0fr] transition-all duration-300 ease-in-out">
          <div class="min-h-0 overflow-hidden">
            <MenuDropdown
              :items="item.children"
              class="mt-1 border-l border-gray-100 pl-4 opacity-0 transition-opacity duration-300 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
      <NuxtLink
        v-else
        :to="item.url || '#'"
        class="flex items-center gap-3 rounded-md p-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
      >
        <Icon v-if="item.icon" :name="item.icon" class="size-5 text-sky-600" />
        <span class="text-sm font-medium">{{ item.label }}</span>
      </NuxtLink>
    </li>
  </ul>
</template>
