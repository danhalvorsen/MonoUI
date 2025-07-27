import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CodeMaintenancePipes',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'cjs']
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'node20',
    rollupOptions: {
      external: ['fs', 'path', 'ts-morph', 'perf_hooks']
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
});
