// File: packages/mr-piano/vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MrPiano',
      fileName: (fmt) => `mr-piano.${fmt}.js`,
      formats: ['es', 'umd']
    },
    sourcemap: true,
    /* 🔧 prevent Vite from deleting dist/, so .d.ts stay in place */
    emptyOutDir: false                               // ← add this line
  },
  resolve: {
    alias: {
      '@packages/mr-piano': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
