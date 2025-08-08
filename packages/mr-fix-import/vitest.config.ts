// packages/mr-fix-import/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    reporters: 'default',
    globals: false,
    watch: false
  }
});