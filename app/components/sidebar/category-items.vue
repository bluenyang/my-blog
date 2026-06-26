<script setup lang="ts">
  import type { CategoryItem } from '~/types/category';

  interface MenuItemProps {
    item: CategoryItem;
  }

  const { item } = defineProps<MenuItemProps>();
  const hasChildren = computed(() => item.children && item.children.length > 0);
  const isChildOpen = ref<boolean>(false);

  const toggleChildOpen = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    isChildOpen.value = !isChildOpen.value;
  };
</script>

<template>
  <li
    class="relative w-full bg-linear-to-r from-blue-300 to-purple-400 dark:from-blue-600 dark:to-purple-700"
  >
    <NuxtLink
      :to="`/categories/${item.slug}`"
      class="bg-sidebar group relative flex w-full items-center justify-between gap-2 truncate px-2 py-1 transition-all duration-200 hover:translate-x-1"
    >
      <div class="flex items-center gap-2">
        <Icon v-if="item.icon" :name="item.icon" class="size-4 text-sky-600" />
        <span
          class="text-base font-medium group-hover:text-purple-700 group-hover:dark:text-indigo-300"
        >
          {{ item.name }}
        </span>
        <span class="bg-muted-foreground rounded-full px-2 text-xs font-semibold">
          {{ item.postCount || 0 }}
        </span>
      </div>
      <button
        v-if="hasChildren"
        class="flex cursor-pointer focus:outline-none"
        @click="toggleChildOpen"
      >
        <Icon :name="isChildOpen ? 'lucide:chevron-down' : 'lucide:chevron-right'" />
      </button>
    </NuxtLink>
    <div
      v-if="item.children && item.children.length > 0"
      :class="cn(isChildOpen ? 'block' : 'hidden')"
    >
      <ul class="bg-sidebar ps-3">
        <CategoryItems v-for="child in item.children" :key="child.id" :item="child" />
      </ul>
    </div>
  </li>
</template>
