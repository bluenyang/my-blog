import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Nuxt 런타임이 필요 없는 순수 함수만 테스트한다.
 * 별칭은 nuxt.config의 규칙(~ = app, ~~ = 루트)과 맞춘다.
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
});
