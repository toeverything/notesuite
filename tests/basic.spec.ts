import { expect, test } from 'playwright/test';
import { TestAgent } from './common/agent.js';

test.describe('basic test', () => {
  const agent = new TestAgent();
  const options = {
    name: 'test-basic',
    webPort: 5173,
    backendPort: 3000,
  };
  test.beforeAll(() => agent.start(options));

  test('local server works', async ({ page }) => {
    await page.goto(agent.web.baseUrl);
    expect(await page.title()).toBe('Note App');
  });

  test('can crete workspace', async ({ page }) => {
    await page.goto(agent.web.baseUrl);
    await page.getByPlaceholder('Workspace name').click();
    await page.getByPlaceholder('Workspace name').fill('hello');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Test Client')).toBeVisible();
  });

  test.afterAll(() => agent.stop());
});
