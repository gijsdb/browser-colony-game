/* eslint-env node */

// @ts-expect-error working
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript'
    // 'plugin:vue/vue3-essential',
    // 'eslint:recommended',
    // '@vue/eslint-config-prettier/skip-formatting',
    // 'plugin:@typescript-eslint/recommended' 
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser', 
    sourceType: 'module', 
    ecmaFeatures: {
      jsx: true
    },
    plugins: [
      '@typescript-eslint', 
    ],
    overrides: [
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ]
  },
 
}
