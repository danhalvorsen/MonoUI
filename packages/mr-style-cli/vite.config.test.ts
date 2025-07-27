import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['dist', 'scripts', 'vite.config.*']
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@scripts': path.resolve(__dirname, 'scripts'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
});
