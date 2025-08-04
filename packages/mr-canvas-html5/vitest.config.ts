// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: 'chromium',
    setupFiles: resolve(__dirname, './src/test-setup.ts'),
    exclude: ['**/node_modules/**'],
    globals: true,
  },
});
