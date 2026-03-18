import { defineConfig, devices } from '@playwright/test';
import { config } from './utils/config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['allure-playwright']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // Base URL from config.yaml
    baseURL: config.baseUrl,

    /* Run tests in headless mode */
    headless: true,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'register',
      testMatch: /register\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'login',
      testMatch: /login\.spec\.ts/,
      dependencies: ['register'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'article-crud',
      testMatch: /article-crud\.spec\.ts/,
      dependencies: ['login'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'follow-profile',
      testMatch: /follow-profile\.spec\.ts/,
      dependencies: ['article-crud'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      name: 'comments',
      testMatch: /comments\.spec\.ts/,
      dependencies: ['follow-profile'],
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

});
