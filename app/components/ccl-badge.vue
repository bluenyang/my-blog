<script setup lang="ts">
  const { settings } = useSetting();

  const visible = computed(() => !!settings.value?.allowCCL);

  const commercialIcon = computed(() =>
    settings.value?.allowCommercial ? 'lucide:badge-dollar-sign' : 'lucide:banknote-x',
  );

  const changeIcon = computed(() => {
    switch (settings.value?.changeContent) {
      case 'share_alike':
        return 'lucide:refresh-cw';
      case 'no_derivative':
        return 'lucide:ban';
      case 'allow':
      default:
        return 'lucide:pencil-line';
    }
  });

  const licenseCode = computed(() => {
    if (!settings.value?.allowCCL) return '';
    const parts = ['CC', 'BY'];
    if (!settings.value.allowCommercial) parts.push('NC');
    if (settings.value.changeContent === 'share_alike') parts.push('SA');
    if (settings.value.changeContent === 'no_derivative') parts.push('ND');
    return parts.join(' ');
  });

  const tooltipLines = computed(() => {
    if (!settings.value?.allowCCL) return [];

    const commercial = settings.value.allowCommercial
      ? '상업적 이용 허용'
      : '상업적 이용 불가 (NonCommercial)';

    const change = (() => {
      switch (settings.value?.changeContent) {
        case 'share_alike':
          return '변경 허용 · 동일 라이선스 유지 (ShareAlike)';
        case 'no_derivative':
          return '변경 금지 (NoDerivatives)';
        case 'allow':
        default:
          return '변경 허용';
      }
    })();

    return ['Creative Commons 적용', `라이선스: ${licenseCode.value}`, commercial, change];
  });
</script>

<template>
  <div v-if="visible" class="group relative inline-flex items-center">
    <button
      type="button"
      class="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
      :aria-label="`라이선스 ${licenseCode}`"
    >
      <Icon name="lucide:creative-commons" class="size-4 shrink-0" />
      <Icon :name="commercialIcon" class="size-4 shrink-0" />
      <Icon :name="changeIcon" class="size-4 shrink-0" />
    </button>
    <div
      role="tooltip"
      class="border-border bg-popover text-popover-foreground pointer-events-none absolute top-full left-0 z-20 mt-2 w-max max-w-64 rounded-md border px-3 py-2 text-left text-xs leading-relaxed opacity-0 shadow-md transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
    >
      <p v-for="(line, index) in tooltipLines" :key="index" :class="index === 0 && 'font-semibold'">
        {{ line }}
      </p>
    </div>
  </div>
</template>
