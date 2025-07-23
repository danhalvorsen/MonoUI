// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/tests/**/*.test.ts'], // or ['**/*.test.ts']
    globals: true,
    environment: 'node',
    logHeapUsage: true,
  }
});
