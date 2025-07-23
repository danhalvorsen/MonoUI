import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    // playwrightLauncher({ product: 'firefox' }),
    // playwrightLauncher({ product: 'webkit' }),
  ],
  files: 'test/**/*.test.js',
  nodeResolve: true,
  testFramework: {
    config: {
      ui: 'bdd',
    },
  },
};