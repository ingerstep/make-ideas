import baseConfig from '../eslint.config.js'
import nodePlugin from 'eslint-plugin-node'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    plugins: {
      node: nodePlugin,
    },
  },
  {
    rules: {
      'node/no-process-env': 'error',
    },
  },
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
  {
    ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.js'],
  },
]
