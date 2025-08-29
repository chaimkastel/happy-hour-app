import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3002',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'Desktop - Chrome',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/*.desktop.test.ts', '**/*.test.ts'],
    },

    {
      name: 'Mobile - iPhone',
      use: { ...devices['iPhone 13'] },
      testMatch: ['**/*.mobile.test.ts', '**/*.test.ts'],
    },

    {
      name: 'Mobile - Android',
      use: { ...devices['Pixel 5'] },
      testMatch: ['**/*.mobile.test.ts'],
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3002',
    reuseExistingServer: !process.env.CI,
  },
});
