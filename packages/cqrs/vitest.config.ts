// File: packages/cqrs/vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@mr/design-patterns': resolve(__dirname, '../design-patterns/src'),
    },
  },
  optimizeDeps: {
    include: ['reflect-metadata', 'tsyringe'],
  },
});
