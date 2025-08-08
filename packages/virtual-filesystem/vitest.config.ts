import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
  resolve: {
    alias: {
      // point directly at the TS source of file-operations
      'file-operations': path.resolve(__dirname, '../file-operations/src/index.ts'),
    },
  },
});
