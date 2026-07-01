<script setup lang="ts">
  import { useCategory } from '~/composables/use-category';
  import { profileData } from '~/constants/sidebar-data';

  const { categories } = useCategory();
  const config = useRuntimeConfig();

  const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="bg-card border-border mt-auto border-t">
    <div class="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        <!-- Profile Section -->
        <div class="col-span-1 lg:col-span-2">
          <div class="flex items-center gap-4">
            <img
              :src="profileData.githubProfileImage"
              alt="Profile"
              class="size-12 rounded-full border-2 border-white shadow-sm"
            />
            <div>
              <h3 class="text-foreground text-lg font-bold">{{ profileData.nickname }}</h3>
              <p class="font-jua text-muted-foreground text-sm">{{ profileData.desc }}</p>
            </div>
          </div>
          <div class="mt-6 flex gap-4">
            <a
              href="https://github.com/bluenyang"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Icon name="mdi:github" class="size-6" />
            </a>
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="RSS"
            >
              <Icon name="mdi:rss" class="size-6" />
            </a>
            <a
              :href="`mailto:${config.public.emailAddress}`"
              class="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Icon name="mdi:email" class="size-6" />
            </a>
          </div>
        </div>

        <!-- Categories Section -->
        <div>
          <h3 class="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
            {{ '카테고리' }}
          </h3>
          <ul class="flex flex-col space-y-2">
            <li v-for="category in categories" :key="category.id">
              <NuxtLink
                :to="{ path: '/search', query: { category: category.slug } }"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Pages Section -->
        <div>
          <h3 class="text-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
            {{ '페이지' }}
          </h3>
          <ul class="flex flex-col space-y-2">
            <li>
              <a
                href="https://www.bluenyang.kr/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {{ '홈페이지' }}
              </a>
            </li>
            <li>
              <NuxtLink
                to="/"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {{ '블로그' }}
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://docs.bluenyang.kr/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                {{ 'Docs' }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="border-border mt-12 border-t pt-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left"
      >
        <p class="text-muted-foreground text-sm">
          {{ `&copy; ${currentYear} ${profileData.nickname}. All rights reserved.` }}
        </p>
        <p class="text-muted-foreground text-sm">
          {{ 'Made with Nuxt.js and Directus' }}
        </p>
      </div>
    </div>
  </footer>
</template>
