import tailwindcss from '@tailwindcss/vite';

import { normalizeSiteUrl } from './shared/utils/normalize-site-url';

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/motion',
    '@vueuse/nuxt',
    '@comark/nuxt',
  ],

  ssr: true,

  // 링크 hover/viewport prefetch가 페이지 payload + Directus API를 연쇄로 때림
  experimental: {
    defaults: {
      nuxtLink: {
        prefetch: false,
      },
    },
  },

  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ko' },
    },
  },

  fonts: {
    families: [
      { name: 'Tektur', provider: 'google', weights: [400, 500, 600, 700, 800, 900] },
      { name: 'Pacifico', provider: 'google' },
      { name: 'Jua', provider: 'google' },
      { name: 'Cascadia Code', provider: 'google', weights: [400, 700] },
    ],
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
    storage: 'cookie',
  },

  runtimeConfig: {
    public: {
      homepageUrl: normalizeSiteUrl(process.env.HOMEPAGE_URL),
      blogUrl: normalizeSiteUrl(process.env.BLOG_URL),
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
    // '/tags/**'는 맨 '/tags'와 매치되지 않으므로 인덱스를 따로 적는다
    '/tags': { swr: 600 },
    '/tags/**': { swr: 180 },
    '/series': { swr: 600 },
    '/series/**': { swr: 180 },
    '/search': { swr: 180 },
    '/license': { swr: 86400 },

    /*
     * /api/* 에는 swr을 걸지 않는다. defineCachedEventHandler가 응답에
     * cache-control: no-cache 를 직접 써서 routeRules가 넣는 s-maxage를 덮어버리기 때문에
     * 실제로는 아무 효과가 없다(측정으로 확인). API 캐시는 핸들러 쪽에만 둔다.
     */

    // rss.xml은 setHeader를 쓰므로 defineCachedEventHandler로 감싸지 않고 여기서 캐시한다
    '/rss.xml': { swr: 3600 },
  },

  compatibilityDate: '2026-06-15',

  nitro: {
    preset: 'netlify-edge',
  },

  image: {
    format: ['webp'],
    quality: 80,
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
        '@shikijs/langs/plsql',
        '@shikijs/langs/ts',
        '@shikijs/langs/tsx',
        '@shikijs/langs/typescript',
        '@shikijs/langs/vue',
        '@shikijs/langs/xml',
        '@shikijs/langs/yaml',
        '@shikijs/langs/yml',
        '@shikijs/themes/one-dark-pro',
        'clsx',
        'comark',
        'comark/plugins/highlight',
        'comark/plugins/toc',
        'comark/utils',
        'tailwind-merge',
        // devtools는 개발 환경에서만 로드되므로 프로덕션 pre-bundle 대상에서 뺀다
        ...(process.env.NODE_ENV === 'development'
          ? ['@vue/devtools-core', '@vue/devtools-kit']
          : []),
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
    exclude: [
      '/api/post/**',
      '/api/home',
      '/api/posts',
      '/api/search',
      '/api/sidebar',
      '/rss.xml',
      '/search',
    ],
  },

  robots: {
    disallow: ['/search', '/api/post/**', '/api/home', '/api/posts', '/api/search', '/api/sidebar'],
  },
});
