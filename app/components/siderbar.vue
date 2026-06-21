<script setup lang="ts">
  import { useSidebar } from '~/composables/use-sidebar';

  const { isOpen: isSidebarOpen, close: closeSidebar } = useSidebar();

  const route = useRoute();
  watch(
    () => route.fullPath,
    () => {
      if (window.innerWidth < 768) {
        closeSidebar();
      }
    },
  );
</script>

<template>
  <div class="relative z-50 md:hidden">
    <Transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-xs"
        @click="closeSidebar"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <div
        v-if="isSidebarOpen"
        class="fixed inset-y-0 left-0 flex h-full w-72 flex-col p-4 shadow-xl"
      >
        <button class="mb-4 self-end p-2 text-gray-500 hover:text-gray-800" @click="closeSidebar">
          ✕
        </button>
        <SidebarContent />
      </div>
    </Transition>
  </div>

  <aside
    class="bg-sidebar border-sidebar-border sticky top-0 hidden h-screen overflow-hidden border-r transition-all duration-300 ease-in-out md:block"
    :class="isSidebarOpen ? 'w-72 p-4' : 'w-0 border-r-0 p-0'"
  >
    <div class="flex h-full flex-col overflow-y-auto pt-3">
      <SidebarContent />
    </div>
  </aside>
</template>
