import { configs } from '@eslint/js'
import { rules as _rules } from 'eslint-config-prettier'
import pluginImport from 'eslint-plugin-import'
import prettierPlugin, { configs as _configs } from 'eslint-plugin-prettier'
import pluginReact, { configs as __configs } from 'eslint-plugin-react'
import { browser, node } from 'globals'
import { plugin } from 'typescript-eslint'
import jestPlugin, { configs as ___configs } from 'eslint-plugin-jest'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: { ...browser, ...node },
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': plugin,
      react: pluginReact,
      prettier: prettierPlugin,
      import: pluginImport,
      jest: jestPlugin,
    },
    rules: {
      ...configs.recommended.rules,
      ...__configs.flat.recommended.rules,
      ..._configs.recommended.rules,
      ..._rules,
      ...___configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: false,
            orderImportKind: 'asc',
          },
        },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      curly: ['error', 'all'],
      'no-irregular-whitespace': ['error', { skipTemplates: true, skipStrings: true }],
      'no-console': ['error', { allow: ['info', 'error', 'warn'] }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['node_modules', 'dist', '*.config.js'],
  },
]
