import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

// ESLint v9では従来のairbnb設定を直接扱うのが難しいため
// 必要なルールを個別に適用する方式で対応します

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      '.git',
      '.github',
      'AI_Docs/md-range-map.js',
    ],
  },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig,
    ],
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      // React Hooks関連
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Tailwind CSS関連
      'tailwindcss/classnames-order': 'warn',
      'tailwindcss/no-custom-classname': 'warn',
      'tailwindcss/no-contradicting-classname': 'error',

      // AirBnB風のルール（エッセンス）
      'no-console': 'warn',
      'no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'prefer-const': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'no-param-reassign': 'warn',
      'no-use-before-define': 'warn',
      'import/prefer-default-export': 'off',
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'always'],
      'comma-dangle': ['warn', 'always-multiline'],
    },
  },
);
