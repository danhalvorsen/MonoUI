import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.spec.ts'],
    setupFiles: ['vitest.setup.ts']
  }
});