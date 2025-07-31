import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'rule-engine',
      fileName: (format) => `index.${format}.js`,
      formats: ['es']
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      external: ['node:module'],
      output: { preserveModules: true, preserveModulesRoot: 'src' }
    }
  },
  plugins: [dts()]
});
