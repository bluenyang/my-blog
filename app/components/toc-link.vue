<script setup lang="ts">
  import { cn } from '~/utils/cn';

  export interface TocLink {
    id: string;
    text: string;
    depth: number;
    children?: TocLink[];
  }

  const { links, activeId } = defineProps<{
    links?: TocLink[];
    /** 현재 화면에 보이는 제목 id */
    activeId?: string;
  }>();
</script>

<template>
  <ul
    v-if="links?.length"
    class="space-y-2 border-l-2 border-neutral-400 ps-2 hover:border-cyan-400"
  >
    <li v-for="link in links" :key="link.id" class="text-muted-foreground">
      <a
        :href="`#${link.id}`"
        :aria-current="activeId === link.id ? 'location' : undefined"
        :class="
          cn(
            'font-jua line-clamp-2 block leading-snug transition-colors hover:font-semibold hover:text-cyan-600 dark:hover:text-cyan-500',
            activeId === link.id && 'text-primary font-semibold',
          )
        "
      >
        {{ link.text }}
      </a>
      <TocLink
        v-if="link.children?.length"
        :links="link.children"
        :active-id="activeId"
        class="mt-2"
      />
    </li>
  </ul>
</template>
