import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/motion',
    '@vueuse/nuxt',
    '@comark/nuxt',
  ],

  ssr: true,

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
          href: 'https://fonts.googleapis.com/css2?family=Cascadia+Code:ital,wght@0,200..700;1,200..700&family=Jua&family=Pacifico&family=Tektur:wght@400..900&display=swap',
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
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      homepageUrl: process.env.HOMEPAGE_URL,
      blogUrl: process.env.BLOG_URL,
      blogSlug: process.env.BLOG_SLUG,
      directusUrl: process.env.DIRECTUS_URL,
      emailAddress: process.env.EMAIL_ADDRESS,
    },
  },

  routeRules: {
    '/': { swr: 180 },
    '/posts': { swr: 180 },
    '/posts/**': { swr: 180 },
    '/categories/**': { swr: 180 },
    '/tags/**': { swr: 180 },
    '/series/**': { swr: 180 },
    '/search': { swr: 180 },
  },

  compatibilityDate: '2026-06-15',

  nitro: {
    preset: 'netlify',
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@comark/vue',
        '@directus/sdk',
        '@shikijs/langs/bash',
        '@shikijs/langs/c',
        '@shikijs/langs/cpp',
        '@shikijs/langs/css',
        '@shikijs/langs/dockerfile',
        '@shikijs/langs/go',
        '@shikijs/langs/html',
        '@shikijs/langs/java',
        '@shikijs/langs/javascript',
        '@shikijs/langs/js',
        '@shikijs/langs/json',
        '@shikijs/langs/jsx',
        '@shikijs/langs/kotlin',
        '@shikijs/langs/md',
        '@shikijs/langs/mdc',
        '@shikijs/langs/py',
        '@shikijs/langs/sh',
        '@shikijs/langs/sql',
        '@shikijs/langs/ts',
        '@shikijs/langs/tsx',
        '@shikijs/langs/typescript',
        '@shikijs/langs/vue',
        '@shikijs/langs/xml',
        '@shikijs/langs/yaml',
        '@shikijs/langs/yml',
        '@shikijs/themes/one-dark-pro',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'clsx',
        'comark',
        'comark/plugins/highlight',
        'tailwind-merge',
      ],
    },
  },

  icon: {
    mode: 'svg',
    cssLayer: 'base',
    size: '1.25em',
  },

  sitemap: {
    sources: ['/api/sitemap-urls'],
    exclude: ['/api/**', '/rss.xml'],
  },
});
