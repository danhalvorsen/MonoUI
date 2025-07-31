import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  resolve: {
    alias: {
      'mr-web-components': path.resolve(__dirname, '../../packages/mr-web-components/dist/src/index.js'),
      '@my-graphics/math': path.resolve(__dirname, '../../packages/math/dist/index.js'),
      '@': path.resolve(__dirname, 'src')
    },
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
