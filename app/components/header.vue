<script setup lang="ts">
  import { TransitionPresets } from '@vueuse/core';

  const { y } = useWindowScroll();
  const rawProgress = computed(() => {
    const progress = y.value / 160;
    return Math.max(0, Math.min(1, progress)); // 0과 1 사이로 값 고정 (Clamp)
  });

  const smoothProgress = useTransition(rawProgress, {
    duration: 400,
    transition: TransitionPresets.easeOutCubic,
  });

  // dock geometry (Scroll에 반응하는 동적 수치들)
  const marginTop = computed(() => smoothProgress.value * 12); // 0 -> 12
  const marginInline = computed(() => smoothProgress.value * 20); // 0 -> 20
  const borderRadius = computed(() => smoothProgress.value * 32); // 0 -> 22
  const paddingY = computed(() => 16 - smoothProgress.value * 4); // 16 -> 12

  const { menuItems } = useNavigationMenu();
  const { categories } = useCategory();

  const { toggle } = useSidebar();
</script>

<template>
  <ClientOnly>
    <header
      v-motion="{
        initial: { opacity: 0, y: -20 },
        enter: { opacity: 1, y: 0, transition: { duration: 550, ease: 'easeOut' } },
      }"
      class="fixed z-50 flex h-18 flex-row items-center justify-center px-4 backdrop-blur-xl backdrop-brightness-104 backdrop-saturate-190 transition-colors duration-500"
      :class="cn(smoothProgress > 0.3 ? 'bg-header-tp' : 'bg-header-bg')"
      :style="{
        top: `${marginTop}px`,
        left: `${marginInline}px`,
        right: `${marginInline}px`,
        borderRadius: `${borderRadius}px`,
        paddingTop: `${paddingY}px`,
        paddingBottom: `${paddingY}px`,
      }"
    >
      <!-- Left side - Mobile menu toggler and Brand -->
      <div class="container flex flex-1 items-center gap-x-4">
        <button
          type="button"
          @click="toggle()"
          class="group inline-flex size-10 cursor-pointer items-center justify-center rounded-full p-2 transition-colors duration-300 hover:bg-white/30 focus:bg-white/30 focus:outline-none"
        >
          <Icon name="lucide:menu" class="size-6" />
        </button>
        <div class="flex py-5 lg:flex-1">
          <a class="group focus:outline-none" href="https://bluenyang-dev.tistory.com/">
            <span
              class="transition-color font-pacifico bg-linear-to-r from-blue-600 to-purple-700 bg-clip-text text-2xl font-bold duration-500 group-hover:text-transparent group-focus:text-transparent dark:from-blue-300 dark:to-purple-400"
            >
              {{ 'BlueNyang' }}
            </span>
          </a>
        </div>
      </div>

      <!-- Center Items - Menu Links (Mobile : Hidden) -->
      <nav class="container hidden items-center justify-center lg:flex lg:flex-1">
        <ul class="flex flex-1 items-center justify-center space-x-4">
          <li v-for="item of menuItems" :key="item.id" class="group relative cursor-default">
            <NuxtLink
              v-if="item.url"
              :to="item.url"
              class="hover:text-accent block cursor-pointer px-4 py-5 font-medium transition-all duration-200 hover:-translate-y-1"
            >
              {{ item.label }}
            </NuxtLink>
            <div v-else>
              <span
                class="hover:text-accent block px-4 py-5 font-medium transition-all duration-200 hover:-translate-y-1"
              >
                {{ item.label }}
              </span>
              <div
                class="invisible absolute left-1/2 mt-1 w-max max-w-4xl -translate-x-1/2 rounded-lg border-2 border-gray-100 bg-white p-4 opacity-0 shadow-xl/30 transition-all duration-800 group-hover:visible group-hover:opacity-100 dark:border-none dark:bg-gray-800"
              >
                <MenuDropdownItem
                  v-if="item.children && item.children.length > 0"
                  :items="item.children"
                />
                <CategoryDropdown v-else-if="item.is_category" :items="categories" />
              </div>
            </div>
          </li>
        </ul>
      </nav>

      <!-- Right Items - Theme Control Button -->
      <div class="container flex flex-1 items-center justify-end">
        <span>theme</span>
      </div>
    </header>
  </ClientOnly>
</template>
