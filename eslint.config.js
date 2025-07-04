// eslint.config.mjs  – flat-config
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import lit from 'eslint-plugin-lit';

export default [
  /* -------- global ignores (replaces .eslintignore) -------- */
  { ignores: ['dist/**', '**/*.d.ts'] },

  /* -------- base JS rules (optional) -------- */
  js.configs.recommended,

  /* -------- TypeScript + Lit -------- */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json', sourceType: 'module' },
      globals: {
        window: 'readonly',
        document: 'readonly',
        CustomEvent: 'readonly',
        MutationObserver: 'readonly',
        fetch: 'readonly',
        HTMLElement: 'readonly',
        CSSStyleSheet: 'readonly',
        customElements: 'readonly',
        console: 'readonly',
      }
    },
    plugins: { '@typescript-eslint': ts, lit },
    rules: {
      ...ts.configs.strict.rules,      // TS best-practices
      ...lit.configs.recommended.rules // Lit safety net
    },
  },

  /* -------- Plain JS + Lit -------- */
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        CustomEvent: 'readonly',
        MutationObserver: 'readonly',
        fetch: 'readonly',
        HTMLElement: 'readonly',
        CSSStyleSheet: 'readonly',
        customElements: 'readonly',
        console: 'readonly',
      }
    },
    plugins: { lit },
    rules: { ...lit.configs.recommended.rules },
  },
];
