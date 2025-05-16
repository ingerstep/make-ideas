import baseConfig from '../eslint.config.js'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...baseConfig,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.node.json', 'tsconfig.app.json'],
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },

  {
    ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.js'],
  },
  {
    files: ['./vite.config.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.node.json', 'tsconfig.app.json'],
      },
    },
  },
]
