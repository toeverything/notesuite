import { PlaywrightTestConfig } from 'playwright/test';

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  use: {
    browserName: 'chromium',
  },
};

export default config;
