// File: packages/mr-slider/vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/mr-slider.ts',   // what to bundle
      name: 'MrSlider',
      fileName: 'mr-slider',
      formats: ['es']              // outputs mr-slider.js (ESM)
    },
    outDir: 'dist',                // bundle goes here
    rollupOptions: { external: [] } // bundle lit too
  }
});
