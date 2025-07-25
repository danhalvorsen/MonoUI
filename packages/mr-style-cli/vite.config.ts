import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/cli.ts'), // CLI entry
      name: 'MrStyleCLI',
      fileName: (format) => `cli.${format}.js`,
      formats: ['es'] // we only need ESM for NodeNext
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true,
    target: 'es2021',
    rollupOptions: {
      external: [
        'fs',
        'path',
        'url',
        'ts-morph',
        'tsyringe',
        'mr-style'
      ]
    }
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@scripts': path.resolve(__dirname, 'scripts')
    }
  },
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts']
  }
});
