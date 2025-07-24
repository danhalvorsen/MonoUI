// File: packages/mr-slider/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test',
  use: { baseURL: 'http://localhost:3030', trace: 'on-first-retry' },
  webServer: {
    command: 'npm run serve',
    url:     'http://localhost:3030',
    reuseExistingServer: !process.env.CI
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});