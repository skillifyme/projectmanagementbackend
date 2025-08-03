// eslint.config.js
import eslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': eslintPlugin
    },
    rules: {
      // Your rules here
      '@typescript-eslint/no-explicit-any': 'error'
    }
  }
];
