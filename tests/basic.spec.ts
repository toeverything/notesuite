import { chromium, Browser, Page } from 'playwright';
import { test } from 'playwright/test';
import { AppRunner } from './runner/runner.js';

test.describe('basic test', () => {
  const runner = new AppRunner();
  test.beforeAll(async () => {
    await Promise.all([runner.startServer(3000), runner.startWeb(5173, 3000)]);
  });

  test('local server works', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:5173');
    await browser.close();
  });

  test.afterAll(async () => await runner.stop());
});
