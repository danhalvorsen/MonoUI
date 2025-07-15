import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      'mr-slider': path.resolve(__dirname, '../../packages/mr-slider/dist/mr-slider.js'),
      'mr-basic': path.resolve(__dirname, '../../packages/mr-basic/dist/mr-basic.js')
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
