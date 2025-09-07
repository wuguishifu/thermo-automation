import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import strictNullChecks from 'eslint-plugin-strict-null-checks';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = defineConfig([
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    extends: compat.extends(
      'plugin:@typescript-eslint/strict',
      'plugin:@typescript-eslint/stylistic',
      'plugin:prettier/recommended',
    ),
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'strict-null-checks': strictNullChecks,
    },
    rules: {
      curly: 'error',
      '@typescript-eslint/no-extraneous-class': 'off',
      'react-hooks/rules-of-hooks': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      'import/first': 'warn',
      '@typescript-eslint/no-unnecessary-type-constraint': 'warn',
      'require-await': 'warn',
      'no-unsafe-optional-chaining': 'warn',
      'no-case-declarations': 'warn',
      'react/jsx-key': 'warn',
      'react/prop-types': 'off',
      'react/display-name': 'warn',
      'react/no-deprecated': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      indent: 'off',
      'no-useless-escape': 'warn',

      'no-empty-function': [
        'warn',
        {
          allow: ['constructors'],
        },
      ],

      'no-useless-catch': 'warn',
      'no-async-promise-executor': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-native/no-inline-styles': 'off',

      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'import/order': [
        'warn',
        {
          'newlines-between': 'always',
          groups: [['external', 'builtin'], ['internal'], ['parent', 'sibling', 'index']],
          pathGroupsExcludedImportTypes: ['react', 'internal'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ['**/*ApiSlice.ts'],
    rules: {
      '@typescript-eslint/no-invalid-void-type': 'off',
    },
  },
]);

export default eslintConfig;
