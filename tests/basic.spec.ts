import { chromium, Browser, Page } from 'playwright';
import { test } from 'playwright/test';

test('basic test', async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173');
  await browser.close();
});
