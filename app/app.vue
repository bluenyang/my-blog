<script setup lang="ts">
  useHead({
    titleTemplate: `%s · BlueNyang's Devlog`,
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'BlueNyang Dev Blog RSS Feed',
        href: '/rss.xml',
      },
    ],
    meta: [
      {
        name: 'naver-site-verification',
        content: '133e30ab5b462674060b7764da34e7307173f594',
      },
    ],
  });
</script>

<template>
  <div>
    <NuxtLoadingIndicator color="oklch(58.8% 0.158 241.966)" :height="4" :throttle="100" />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="{ name: 'fade', mode: 'out-in' }" />
    </NuxtLayout>
  </div>
</template>
