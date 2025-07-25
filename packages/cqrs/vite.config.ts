import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MrCQRS',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2021'
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
