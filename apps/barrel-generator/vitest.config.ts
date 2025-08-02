import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.{test,spec}.{ts,js}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**']
    },
    // Add verbose logging options
    logHeapUsage: true,     // Log heap usage after each test
    reporters: ['verbose'],  // Use the verbose reporter for more detailed output
    outputFile: {
      json: './test-results/results.json' // Save detailed test results as JSON
    },
    testTimeout: 10000,     // Increase test timeout for debugging
    retry: 0,               // Don't retry failed tests
    pool: 'threads',        // Use threads pool for tests
    poolOptions: {
      threads: {
        useAtomics: true,
        singleThread: true  // Run in a single thread for clearer logs
      }
    },
    onConsoleLog(log, type) {
      // Don't filter any console logs during tests
      return false;
    }
  }
});