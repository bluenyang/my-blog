import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@vueuse/motion',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
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

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      blogUrl: process.env.BLOG_URL,
      blogSlug: process.env.BLOG_SLUG,
      directusUrl: process.env.DIRECTUS_URL,
      emailAddress: process.env.EMAIL_ADDRESS,
    },
  },

  routeRules: {
    '/': { prerender: false },
  },
  compatibilityDate: '2026-06-15',

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'clsx', 'tailwind-merge'],
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },

  icon: {
    mode: 'css',
    cssLayer: 'base',
    size: '1.25em',
  },
});
