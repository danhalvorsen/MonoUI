// packages/mr-piano/vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
    }
  },
  resolve: {
    alias: {
      '@packages/mr-piano': path.resolve(__dirname, 'src'),
    },
  },
});
