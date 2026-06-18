import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxt/icon',
    '@vueuse/motion',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/eslint',
    '@nuxtjs/robots',
  ],
  devtools: {
    enabled: true,
  },

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Google Fonts
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Jua&family=Pacifico&family=Tektur:wght@400..900&display=swap',
        },
        // Highlight.js CSS
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/a11y-dark.min.css',
        },
      ],
      script: [
        // Highlight.js Library
        {
          src: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js',
          defer: true,
        },
        // Inline Script 실행
        {
          innerHTML:
            'document.addEventListener("DOMContentLoaded", (event) => { hljs.highlightAll(); });',
          type: 'text/javascript',
        },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://blog.bluenyang.kr',
    name: "BlueNyang's Dev-log",
  },

  routeRules: {
    '/': { prerender: false },
  },
  compatibilityDate: '2026-06-15',

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
});
