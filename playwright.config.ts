import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/*.pl.tsx'],
  timeout: 30000,
  expect: {
    timeout: 10000
  },
  webServer: {
    command: 'npm start',
    port: 4000,
    reuseExistingServer: true
  },
  use: {
    baseURL: 'http://localhost:4000',
    browserName: 'chromium',
    headless: true
  }
});
