import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PAYMENT_CENTER_URL || 'http://localhost:3001';
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 30_000,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    { name: 'api', testMatch: '**/api/*.spec.js' },
    { name: 'chrome', testMatch: '**/ui/*.spec.js', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],
});
