// packages/mr-style/vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MrStyle',
      fileName: (format) => `index.${format}.js`,
      formats: ['es'] // Pure ESM; add 'cjs' if Node consumers need it
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2021'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
