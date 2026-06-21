<script setup lang="ts">
  useHead({
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'BlueNyang Dev Blog RSS Feed',
        href: '/rss.xml',
      },
    ],
  });
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
