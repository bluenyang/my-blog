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
  <li class="">
    <div
      class="md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
    >
      <NuxtLink
        :to="`/categories/${item.slug}`"
        class="bg-sidebar group flex items-center justify-between gap-2 transition-all duration-200 md:hover:translate-x-1"
      >
        <div class="flex min-w-0 items-center gap-2 px-2 py-1">
          <Icon v-if="item.icon" :name="item.icon" class="size-4 shrink-0 text-sky-600" />
          <span
            class="flex-1 truncate text-base font-medium md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300"
          >
            {{ item.name }}
          </span>
          <span class="bg-muted-foreground shrink-0 rounded-full px-2 text-xs font-semibold">
            {{ item.postCount || 0 }}
          </span>
        </div>
        <button
          v-if="hasChildren"
          class="hover:bg-sidebar-accent me-1 flex size-6 cursor-pointer items-center justify-center rounded-full focus:outline-none"
          @click="toggleChildOpen"
        >
          <Icon
            name="radix-icons:caret-down"
            class="size-6 transition-transform duration-200"
            :class="isChildOpen ? 'rotate-180' : ''"
          />
        </button>
      </NuxtLink>
    </div>
    <div
      v-if="hasChildren"
      class="grid overflow-hidden transition-[grid-template-rows] duration-200 ease-in-out"
      :class="isChildOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="overflow-hidden">
        <ul class="bg-sidebar ps-3">
          <CategoryItems v-for="child in item.children" :key="child.id" :item="child" />
        </ul>
      </div>
    </div>
  </li>
</template>
