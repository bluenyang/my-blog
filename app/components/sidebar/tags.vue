<script setup lang="ts">
  const { tags } = useTag();
</script>

<template>
  <div class="px-2 py-4">
    <div class="mb-3 px-2 text-sm font-bold">{{ '태그' }}</div>
    <ul class="flex flex-wrap gap-2 px-2">
      <li v-for="tag in tags" :key="tag.id">
        <NuxtLink
          :to="{ path: '/search', query: { tag: tag.slug } }"
          class="bg-sidebar-accent hover:bg-sidebar-accent-hover flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors"
        >
          <span>{{ tag.name }}</span>
          <span class="text-muted-foreground text-xs">{{ tag.postCount }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
