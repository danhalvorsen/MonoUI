// vite.config.ts
import progress from 'vite-plugin-progress';

export default {
  logLevel: 'info',       // keep detailed logs
  clearScreen: false,     // don't wipe terminal
  plugins: [progress()]   // ████ 87 %
};