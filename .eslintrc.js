module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  env: {
    node: true,
    es2021: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '.next/',
    'coverage/',
    '*.config.js',
    '*.config.ts',
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'warn',
  },
};
