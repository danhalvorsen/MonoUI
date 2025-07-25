// File: packages/file-operations/vite.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FileOperation',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'] // Node-compatible ESM
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'node20',        // <---- Node target
    rollupOptions: {
      external: ['fs', 'path'] // <---- don't bundle Node builtins
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts']
  }
});
