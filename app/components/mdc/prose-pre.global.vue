<script setup lang="ts">
  defineProps<{
    code: string;
    language?: string;
    filename?: string;
    highlights?: number[];
    meta?: string;
  }>();

  const copied = ref(false);
  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }
</script>

<template>
  <div
    class="bg-block-bg border-codeblock-accent divide-sidebar-border my-4 flex flex-col gap-2 divide-y rounded-2xl border-s-3 p-4"
  >
    <div class="flex justify-between px-2 pb-2">
      <span class="text-primary! font-jua">{{ language || 'text' }}</span>
      <button class="size-4 cursor-pointer" @click="copyCode(code)">
        <Icon :name="copied ? 'lucide:copy-check' : 'lucide:copy'" class="size-4 text-white" />
      </button>
    </div>
    <pre class="[&>code]:font-cascadia-code text-sm"><slot /></pre>
  </div>
</template>
