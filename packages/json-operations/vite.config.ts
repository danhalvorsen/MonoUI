import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
      { find: '@tests', replacement: fileURLToPath(new URL('./tests', import.meta.url)) }
    ]
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'json-io',
      fileName: (format) => `json-io.${format}.js`
    },
    rollupOptions: {
      external: ['fs', 'path'],
      output: {
        globals: {
          fs: 'fs',
          path: 'path'
        }
      }
    }
  }
});
