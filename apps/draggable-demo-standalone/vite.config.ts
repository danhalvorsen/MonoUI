import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
    conditions: ['esm']
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        format: 'esm'
      }
    }
  },
  server: {
    open: true
  }
});
