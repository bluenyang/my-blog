<script setup lang="ts">
  const { series } = useSeries();
  const route = useRoute();
</script>

<template>
  <div class="px-2 py-4">
    <div class="mb-1 px-2 text-sm font-bold">{{ '시리즈' }}</div>
    <ul class="flex flex-col">
      <li v-for="item in series" :key="item.id" class="w-full">
        <div
          class="bg-sidebar group relative flex w-full items-center gap-2 truncate transition-all duration-200 md:hover:translate-x-1"
          :class="
            route.path === '/search' && route.query.series === item.slug
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : ''
          "
        >
          <NuxtLink
            :to="{ path: '/search', query: { series: item.slug } }"
            class="flex min-w-0 flex-1 items-center gap-2 px-2 py-1"
          >
            <Icon name="radix-icons:bookmark" class="size-4 shrink-0 text-sky-600" />
            <span
              class="truncate text-base font-medium transition-colors"
              :class="
                route.path === '/search' && route.query.series === item.slug
                  ? 'text-sidebar-primary font-bold'
                  : 'md:group-hover:text-purple-700 md:group-hover:dark:text-indigo-300'
              "
            >
              {{ item.name }}
            </span>
            <span
              class="bg-muted-foreground rounded-full px-2 text-xs font-semibold"
              :class="
                route.path === '/search' && route.query.series === item.slug
                  ? 'text-sidebar-primary-foreground bg-sidebar-primary'
                  : 'text-white'
              "
            >
              {{ item.postCount || 0 }}
            </span>
          </NuxtLink>
        </div>
      </li>
    </ul>
  </div>
</template>
