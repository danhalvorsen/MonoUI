import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src/input/cli.ts'),
      formats: ['es'],
      fileName: (format) => `cli.${format}.js`
    },
    rollupOptions: {
      external: [
        // Explicitly mark these as external
        'file-operations',
        'json-operations',
        /^node:.*/,  // Any Node.js built-ins with the 'node:' prefix
        'path',
        'fs',
        'url',
        'glob',
        'process' // Explicitly mark process as external
      ],
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src'
      }
    },
    sourcemap: true,
    minify: false,
    target: 'esnext'
  }
});