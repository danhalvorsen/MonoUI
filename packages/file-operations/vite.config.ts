import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'FileOperations',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2021'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
});
