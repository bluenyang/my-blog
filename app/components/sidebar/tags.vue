<script setup lang="ts">
  const { tags } = useTag();
  const route = useRoute();
</script>

<template>
  <div class="px-2 py-4">
    <div class="mb-3 px-2 text-sm font-bold">{{ '태그' }}</div>
    <ul class="flex flex-wrap gap-2 px-2">
      <li v-for="tag in tags" :key="tag.id">
        <NuxtLink
          :to="{ path: '/search', query: { tag: tag.slug } }"
          class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
          :class="
            route.path === '/search' && route.query.tag === tag.slug
              ? 'bg-sidebar-primary text-sidebar-primary-foreground'
              : 'bg-sidebar-accent hover:bg-sidebar-accent-hover text-sidebar-foreground'
          "
        >
          <span>{{ tag.name }}</span>
          <span
            class="text-xs"
            :class="
              route.path === '/search' && route.query.tag === tag.slug
                ? 'text-sidebar-primary-foreground/80'
                : 'text-muted-foreground'
            "
            >{{ tag.postCount }}</span
          >
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
