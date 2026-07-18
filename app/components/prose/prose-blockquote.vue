<script setup lang="ts">
  defineProps<{
    as?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
  }>();

  const config = {
    note: { icon: 'i-lucide-info', borderColor: 'border-blue-500', iconColor: 'text-blue-500' },
    tip: {
      icon: 'i-lucide-lightbulb',
      borderColor: 'border-green-500',
      iconColor: 'text-green-500',
    },
    important: {
      icon: 'i-lucide-message-square-warning',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-500',
    },
    warning: {
      icon: 'i-lucide-triangle-alert',
      borderColor: 'border-yellow-500',
      iconColor: 'text-yellow-500',
    },
    caution: { icon: 'i-lucide-flame', borderColor: 'border-red-500', iconColor: 'text-red-500' },
  };
</script>

<template>
  <div
    :class="
      cn(
        'border-blockquote-accent bg-block-bg my-4 rounded-md border-s-3 p-4',
        as && config[as].borderColor,
      )
    "
  >
    <Icon
      v-if="as"
      :name="config[as].icon"
      :class="cn('text-blockquote-accent', as && config[as].iconColor)"
    />
    <slot />
  </div>
</template>
