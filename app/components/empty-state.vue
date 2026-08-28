<script setup lang="ts">
  import { cn } from '~/utils/cn';

  const { icon, tone = 'muted' } = defineProps<{
    icon: string;
    title: string;
    description?: string;
    tone?: 'muted' | 'error';
  }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-24 text-center">
    <Icon
      :name="icon"
      :class="
        cn(
          'mb-4 size-12',
          tone === 'error' ? 'text-destructive' : 'text-muted-foreground opacity-50',
        )
      "
    />
    <p :class="cn('text-lg', tone === 'error' ? 'text-destructive' : 'text-muted-foreground')">
      {{ title }}
    </p>
    <p v-if="description" class="text-muted-foreground mt-2 max-w-md text-sm">
      {{ description }}
    </p>
  </div>
</template>
