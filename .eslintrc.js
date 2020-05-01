module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'eslint-plugin-jest'
  ],
  rules: {
    'max-len': ['warn', { 'code': 120 } ],
    'no-underscore-dangle': ["off"],
    'import/prefer-default-export': ["off"],
  },
};
