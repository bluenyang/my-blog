<script setup lang="ts">
  import type { NavigationItem } from '~/types/header';

  interface LinkItemProps {
    item: NavigationItem;
  }

  const { item } = defineProps<LinkItemProps>();
  const hasChild = computed<boolean>(() => !!item.children && item.children.length > 0);

  const childOpen = ref<boolean>(false);

  const toggleChild = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    childOpen.value = !childOpen.value;
  };
</script>

<template>
  <li>
    <NuxtLink
      :to="item.url ?? ''"
      :target="item.url ? '_blank' : undefined"
      rel="noopener noreferrer"
      class="flex items-center justify-between rounded-lg"
      :class="cn(!hasChild && 'md:hover:bg-accent md:hover:text-accent-foreground cursor-pointer')"
    >
      <div class="flex min-w-0 items-center gap-2 px-2 py-1.5">
        <Icon :name="item.icon || 'lucide:link'" class="size-4 shrink-0" />
        <span class="truncate">{{ item.label }}</span>
      </div>
      <button
        v-if="hasChild"
        class="md:hover:bg-sidebar-accent me-1 flex size-6 shrink-0 items-center justify-center rounded-full"
        @click="toggleChild"
      >
        <Icon
          name="radix-icons:caret-down"
          class="size-6 transition-transform duration-200"
          :class="childOpen ? 'rotate-180' : ''"
        />
      </button>
    </NuxtLink>
    <ul
      v-if="hasChild"
      class="ml-3 overflow-hidden transition-all duration-200 ease-in-out"
      :class="cn(childOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')"
    >
      <LinkItems v-for="child in item.children" :key="child.id" :item="child" />
    </ul>
  </li>
</template>
