import process from 'process';

import eslint from '@eslint/js';
import pluginImport from 'eslint-plugin-import-x';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginPromise from 'eslint-plugin-promise';
import pluginUnicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

import withNuxt from './.nuxt/eslint.config.mjs';

const promisePlugin = /** @type {any} */ (pluginPromise);

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default withNuxt(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: pluginImport,
      promise: promisePlugin,
      unicorn: pluginUnicorn,
    },
    rules: {
      /* Promise Rules */
      ...promisePlugin.configs.recommended.rules,
      'promise/catch-or-return': 'off',
      'promise/always-return': 'off',

      /* Import Rules */
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      /* Unicorn Rules */
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            camelCase: true,
          },
          ignore: [
            /.*~\d{8}-\d{6}\..*$/, // Syncthing
          ],
        },
      ],
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',

      /* Nuxt/Vue Env Rules */
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module',
      },
    },
    rules: {
      'vue/attributes-order': [
        'warn',
        {
          alphabetical: false,
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            ['UNIQUE', 'SLOT'],
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT',
          ],
        },
      ],
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'warn',
    },
  },
  eslintPluginPrettierRecommended,
);
