<script setup lang="ts">
  import CategoryItems from './category-items.vue';

  const { categories, total } = useCategory();
</script>

<template>
  <div class="px-2 py-4">
    <ul class="flex flex-col gap-2">
      <li
        class="relative w-full bg-linear-to-r from-blue-300 to-purple-400 dark:from-blue-600 dark:to-purple-700"
      >
        <NuxtLink
          :to="`/posts`"
          class="bg-sidebar group relative flex w-full items-center gap-2 truncate px-2 py-1 transition-all duration-200 hover:translate-x-1"
        >
          <span class="font-medium group-hover:text-purple-700 group-hover:dark:text-indigo-300">{{
            '전체 글'
          }}</span>
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
