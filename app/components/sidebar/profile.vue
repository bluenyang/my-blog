<script setup lang="ts">
  import { profileData } from '~/constants/sidebar-data';

  const { total } = useCategory();
</script>

<template>
  <div class="flex flex-col space-y-3 px-4">
    <div class="flex items-center justify-start gap-4">
      <img
        :src="profileData.githubProfileImage"
        alt="BlueNyang"
        class="size-10 rounded-full border-2 border-white"
      />
      <div class="space-y-1">
        <h3 class="text-start text-xl font-bold">{{ profileData.nickname }}</h3>
        <p class="font-jua text-start text-sm text-gray-600 dark:text-gray-400">
          {{ profileData.desc }}
        </p>
      </div>
    </div>
    <div class="flex items-center justify-start gap-6">
      <div class="flex items-center gap-1">
        <span class="font-jua text-base font-bold">{{ total }}</span>
        <span class="flex text-sm text-gray-600 dark:text-gray-400">{{ '포스트' }}</span>
      </div>
      <!-- <div class="flex items-center gap-1">
        <span class="font-jua text-base font-bold">{{ total }}</span>
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ '포스트' }}</span>
      </div> -->
    </div>
    <div class="flex justify-start gap-3">
      <a
        v-for="(link, index) in profileData.link"
        :key="index"
        :href="link.url"
        class="text-foreground hover:text-accent transition-transform duration-300 hover:-translate-y-0.5"
        :aria-label="link.name"
        :target="link.target"
      >
        <Icon :name="link.icon" class="size-5" />
      </a>
    </div>
  </div>
</template>
