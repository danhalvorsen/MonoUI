import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import fs from 'fs';

const packages = fs
  .readdirSync('./packages', { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => resolve(__dirname, 'packages', d.name, 'src'));

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['packages/*/tests/**/*.test.ts'],
    setupFiles: ['packages/*/tests/setup.ts']
  },
  resolve: {
    alias: [
      { find: '@mono', replacement: resolve(__dirname, 'packages') }
    ]
  }
});
