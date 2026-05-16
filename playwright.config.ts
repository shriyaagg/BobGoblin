import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './tests',

  fullyParallel: true,

  forbidOnly: false,

  retries: 0,

  workers: 1,

  reporter: 'html',

  timeout: 30000,

  use: {

    baseURL: 'http://localhost:3000',

    trace: 'on-first-retry',

    actionTimeout: 10000,

    navigationTimeout: 15000,

  },

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],

});