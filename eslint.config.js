const eslint = require('@eslint/js');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  eslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      'no-console': 'warn',
      'eqeqeq': ['error', 'always'],
      'curly': 'error'
    },
    ignores: ['**/coverage/**', 'coverage/**', 'tests/**'],
  }
];
