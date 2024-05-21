import { PlaywrightTestConfig } from 'playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    browserName: 'chromium',
  },
  projects: [
    {
      name: 'demo',
      testMatch: 'tests/common/demo.ts',
    },
  ],
};

export default config;
