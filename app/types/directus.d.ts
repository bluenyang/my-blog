import type { DirectusClient } from '#shared/directus';

declare module '#app' {
  interface NuxtApp {
    $directus: DirectusClient;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $directus: DirectusClient;
  }
}

export {};
