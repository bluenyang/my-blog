import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/mdc',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@vueuse/motion',
    '@vueuse/nuxt',
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
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  mdc: {
    highlight: {
      theme: 'one-dark-pro',
      langs: [
        'sh',
        'bash',
        'c',
        'c++',
        'cpp',
        'js',
        'javascript',
        'jsx',
        'ts',
        'typescript',
        'tsx',
        'vue',
        'css',
        'html',
        'json',
        'md',
        'mdc',
        'yaml',
        'yml',
        'go',
        'java',
        'kotlin',
        'xml',
        'py',
        'dockerfile',
      ],
    },
    components: {
      prose: true,
    },
  },

  runtimeConfig: {
    public: {
      blogUrl: process.env.BLOG_URL,
      blogSlug: process.env.BLOG_SLUG,
      directusUrl: process.env.DIRECTUS_URL,
      directusOidcProvider: process.env.DIRECTUS_OIDC_PROVIDER,
      emailAddress: process.env.EMAIL_ADDRESS,
    },
  },

  routeRules: {
    '/': { prerender: false },
  },

  compatibilityDate: '2026-06-15',

  nitro: {
    preset: 'netlify',
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        '@directus/sdk',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'clsx',
        'tailwind-merge',
      ],
    },
  },

  hooks: {
    async 'prerender:routes'(ctx) {
      const { fetchPublishedPostPaths } = await import('./server/utils/content-routes');
      const directusUrl = process.env.DIRECTUS_URL || '';
      const blogSlug = process.env.BLOG_SLUG || '';

      try {
        const paths = await fetchPublishedPostPaths(directusUrl, blogSlug);
        for (const path of paths) {
          ctx.routes.add(path);
        }
      } catch (error) {
        console.error('[prerender:routes] Failed to load post paths:', error);
      }
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
    mode: 'svg',
    cssLayer: 'base',
    size: '1.25em',
  },

  sitemap: {
    sources: ['/api/sitemap-urls'],
    exclude: ['/api/**', '/rss.xml'],
  },
});
