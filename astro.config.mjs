// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import tistoryPreviewer from '@tistory-skin-previewer/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [ tistoryPreviewer() ],
  vite: {
    plugins: [
      // @ts-ignore
      tailwindcss()
    ],
  },
  build: {
    format: 'file',
  }
});