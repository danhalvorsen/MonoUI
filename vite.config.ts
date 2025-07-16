// vite.config.ts (used only for Vite dev/build, not tests)
import { defineConfig } from 'vite';
import progress from 'vite-plugin-progress';

export default defineConfig({
  logLevel: 'info',
  clearScreen: false,
  plugins: [progress()]
});