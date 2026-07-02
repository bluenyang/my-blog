<script setup lang="ts">
  export interface TocLink {
    id: string;
    text: string;
    depth: number;
    children?: TocLink[];
  }

  const { links } = defineProps<{
    links?: TocLink[];
  }>();
</script>

<template>
  <ul v-if="links?.length" class="border-border space-y-2 border-l-2 pl-4">
    <li
      v-for="link in links"
      :key="link.id"
      :class="[
        'transition-colors',
        link.depth === 3 ? 'ml-4' : '',
        link.id ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground',
      ]"
    >
      <a :href="`#${link.id}`" class="line-clamp-2 block leading-snug">
        {{ link.text }}
      </a>
      <TocLink v-if="link.children?.length" :links="link.children" class="mt-2" />
    </li>
  </ul>
</template>
