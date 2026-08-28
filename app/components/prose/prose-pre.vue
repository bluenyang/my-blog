<script setup lang="ts">
  import { langIcon } from '~/constants/language-icons';
  import { cn } from '~/utils/cn';

  const props = defineProps<{
    code?: string;
    language?: string;
    meta?: string;
    class?: string;
  }>();

  const copied = ref(false);
  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }

  const iconName = computed<string | null>(() => {
    if (!props.language) return null;
    const icon = langIcon[props.language];
    return icon ? `devicon:${icon}` : null;
  });
</script>

<template>
  <div
    class="bg-codeblock-bg border-codeblock-accent divide-sidebar-border my-4 flex flex-col gap-2 divide-y overflow-hidden rounded-2xl border-s-3"
  >
    <div class="flex items-center justify-between bg-white/40 px-4 py-2">
      <div class="flex items-center gap-2">
        <Icon v-if="iconName" :name="iconName" class="size-6" />
        <span class="font-jua text-amber-400">{{ language || 'text' }}</span>
      </div>
      <button class="size-4 cursor-pointer" @click="copyCode(code || '')">
        <Icon :name="copied ? 'lucide:copy-check' : 'lucide:copy'" class="size-4 text-white" />
      </button>
    </div>
    <pre
      :class="
        cn(
          '[&>code]:font-cascadia-code min-w-0 scrollbar-thin overflow-x-auto px-4 pt-2 pb-4 text-sm',
          $props.class,
        )
      "
    ><slot /></pre>
  </div>
</template>
