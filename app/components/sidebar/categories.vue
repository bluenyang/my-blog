<script setup lang="ts">
  import CategoryItems from './category-items.vue';

  const { categories, total } = useCategory();
</script>

<template>
  <div class="px-2 py-4">
    <ul class="flex flex-col gap-2">
      <li
        class="relative w-full md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
      >
        <NuxtLink
          :to="`/posts`"
          class="bg-sidebar group relative flex w-full items-center gap-2 truncate px-2 py-1 transition-all duration-200 md:hover:translate-x-1"
        >
          <span
            class="font-medium md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300"
            >{{ '전체 글' }}</span
          >
          <span class="bg-muted-foreground rounded-full px-3 text-sm">
            {{ total || 0 }}
          </span>
        </NuxtLink>
      </li>
      <li>
        <ul>
          <CategoryItems v-for="item in categories" :key="item.id" :item="item" />
        </ul>
      </li>
    </ul>
  </div>
</template>
