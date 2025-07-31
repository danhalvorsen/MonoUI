// vitest.browser.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    setupFiles: resolve(__dirname, './src/test-setup.ts'),
    exclude: ['**/e2e/**', '**/node_modules/**', '**/dist/**'],
    browser: {
      enabled: true,
      provider: 'playwright',
      name: 'chromium',
      headless: true,
    },
  },
  ssr: {
    external: [
      'chromium-bidi',
      'chromium-bidi/lib/cjs/bidiMapper/BidiMapper',
      'chromium-bidi/lib/cjs/cdp/CdpConnection',
    ],
  },
  optimizeDeps: {
    exclude: ['chromium-bidi'],
  },
});


