<script setup lang="ts">
  import { profileData } from '~/constants/sidebar-data';
</script>

<template>
  <div
    class="border-muted bg-card w-2xs space-y-4 overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="relative overflow-hidden bg-white/20 px-4 py-2">
      <div class="flex items-center gap-x-3">
        <Icon name="lucide:circle-user" class="text-foreground size-6" />
        <h2 class="text-lg font-semibold tracking-tight">{{ profileData.title }}</h2>
      </div>
    </div>
    <img
      :src="profileData.githubProfileImage"
      alt="BlueNyang"
      class="mx-auto mt-4 h-24 w-24 rounded-full border-4 border-white"
    />
    <div class="gap-2 px-6">
      <h3 class="text-center text-xl font-bold">{{ profileData.nickname }}</h3>
      <p class="font-jua text-center text-sm text-gray-600 dark:text-gray-400">
        {{ profileData.desc }}
      </p>
    </div>
    <div class="mb-4 flex justify-center gap-3 px-4">
      <a :href="profileData.website" class="text-secondary" aria-label="Homepage">
        <Icon
          name="mdi:home"
          class="text-foreground hover:text-accent size-7 transition-transform duration-300 hover:-translate-y-0.5"
        />
      </a>
      <a :href="profileData.github" class="text-secondary" aria-label="GitHub">
        <Icon
          name="mdi:github"
          class="text-foreground hover:text-accent size-7 transition-transform duration-300 hover:-translate-y-0.5"
        />
      </a>
      <a :href="profileData.instagram" class="text-secondary" aria-label="Instagram">
        <Icon
          name="mdi:instagram"
          class="text-foreground hover:text-accent size-7 transition-transform duration-300 hover:-translate-y-0.5"
        />
      </a>
    </div>
  </div>
</template>
