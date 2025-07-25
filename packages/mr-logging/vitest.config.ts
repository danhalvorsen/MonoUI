import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: resolve(__dirname, './vitest.setup.ts'),
    coverage: {
      provider: 'v8',                  // Use V8 for fast coverage
      reporter: ['text', 'html'],      // Console summary + HTML report
      reportsDirectory: './coverage',  // Output folder
      exclude: ['dist', 'tests', 'node_modules'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
