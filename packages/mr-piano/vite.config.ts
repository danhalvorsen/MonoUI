// packages/mr-piano/vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MrPiano',
      fileName: (fmt) => `mr-piano.${fmt}.js`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
    emptyOutDir: false, // keep .d.ts
  },
  resolve: {
    alias: {
      '@packages/mr-piano': path.resolve(__dirname, 'src'),
    },
  },
});
