<script setup lang="ts">
  import CategoryItems from './category-items.vue';

  const { categories, total } = useCategory();
  const route = useRoute();
</script>

<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-sm font-bold">{{ '카테고리' }}</div>
    <ul class="flex flex-col">
      <li
        class="relative w-full md:bg-linear-to-b md:from-blue-300 md:to-purple-400 dark:md:from-blue-400 dark:md:to-purple-500"
      >
        <div
          class="bg-sidebar group relative flex w-full items-center gap-2 truncate transition-all duration-200 md:hover:translate-x-1"
          :class="route.path === '/posts' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''"
        >
          <NuxtLink :to="`/posts`" class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1">
            <Icon
              v-if="!route.path.startsWith('/posts')"
              name="radix-icons:archive"
              class="size-4 shrink-0 text-sky-600"
            />
            <Icon v-else name="radix-icons:archive" class="text-sidebar-primary size-4 shrink-0" />
            <span
              class="text-lg font-medium transition-colors"
              :class="
                route.path === '/posts'
                  ? 'text-sidebar-primary font-bold'
                  : 'md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300'
              "
            >
              {{ '전체 글' }}
            </span>
            <span
              class="bg-muted-foreground rounded-full px-3 text-sm font-semibold"
              :class="
                route.path === '/posts'
                  ? 'text-sidebar-primary-foreground bg-sidebar-primary'
                  : 'text-white'
              "
            >
              {{ total || 0 }}
            </span>
          </NuxtLink>
        </div>
      </li>
      <CategoryItems v-for="item in categories" :key="item.id" :item="item" />
    </ul>
  </div>
</template>
