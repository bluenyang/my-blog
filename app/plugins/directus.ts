import { createDirectusClient } from '#shared/directus';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const url = config.public.directusUrl;

  if (!url) {
    throw new Error('[directus] runtimeConfig.public.directusUrl is not set');
  }

  const directus = createDirectusClient(url);

  return {
    provide: {
      directus,
    },
  };
});
