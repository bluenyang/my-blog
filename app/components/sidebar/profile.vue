<script setup lang="ts">
  import { profileData } from '~/constants/sidebar-data';
</script>

<template>
  <div class="flex flex-col space-y-3">
    <img
      :src="profileData.githubProfileImage"
      alt="BlueNyang"
      class="mx-auto mt-4 h-24 w-24 rounded-full border-4 border-white"
    />
    <div class="space-y-1 px-6">
      <h3 class="text-center text-xl font-bold">{{ profileData.nickname }}</h3>
      <p class="font-jua text-center text-sm text-gray-600 dark:text-gray-400">
        {{ profileData.desc }}
      </p>
    </div>
    <div class="mb-4 flex justify-center gap-3 px-4">
      <a
        v-for="(link, index) in profileData.link"
        :key="index"
        :href="link.url"
        class="text-foreground hover:text-accent transition-transform duration-300 hover:-translate-y-0.5"
        :aria-label="link.name"
        :target="link.target"
      >
        <Icon :name="link.icon" class="size-6" />
      </a>
    </div>
  </div>
</template>
