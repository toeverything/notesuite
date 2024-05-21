import { expect, test } from 'playwright/test';
// @ts-ignore
import { AppRunner } from './runner/runner.js';

test.describe('basic test', () => {
  const runner = new AppRunner();
  test.beforeAll(async () => {
    await Promise.all([
      runner.startServer(3000, 'test-basic'),
      runner.startWeb(5173, 3000),
    ]);
  });

  test('local server works', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const title = await page.title();
    expect(title).toBe('Note App');
  });

  // test.afterAll(async () => await runner.stop());
});
