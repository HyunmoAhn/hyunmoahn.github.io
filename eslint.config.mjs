import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        performance: 'readonly',
        fetch: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        // ES2015+ globals
        Promise: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        Symbol: 'readonly',
        // TypeScript/JSX
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
    },
    rules: {
      // TypeScript ESLint recommended rules
      ...tsPlugin.configs.recommended.rules,

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Custom overrides from original config
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'react/no-array-index-key': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-one-expression-per-line': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/prefer-default-export': 'off',
      'react/function-component-definition': 'off',
      'arrow-body-style': 'off',
      'react/prop-types': 'off',
      'import/no-extraneous-dependencies': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-webpack-loader-syntax': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'react/jsx-filename-extension': 'off',
      'implicit-arrow-linebreak': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',

      // Additional common React/TypeScript rules
      // Note: react/jsx-uses-react is not needed with React 19+ automatic JSX runtime
      'react/jsx-uses-vars': 'error',
      'react-hooks/static-components': 'off',
      'react-hooks/set-state-in-effect': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    // Ignore patterns
    ignores: ['node_modules/**', 'build/**', '.docusaurus/**', 'static/**', '*.config.js'],
  },
];
