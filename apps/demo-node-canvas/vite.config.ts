import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: [
      { find: '@my-graphics/math', replacement: path.resolve(__dirname, '../../packages/math/src') },
    ]
  },
  build: {
    rollupOptions: {
      external: [],
    }
  }
});