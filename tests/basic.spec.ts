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

  test('can create workspace', async ({ page }) => {
    await page.goto(agent.web.baseUrl);
    await page.getByPlaceholder('Workspace name').click();
    await page.getByPlaceholder('Workspace name').fill('hello');
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Test Client')).toBeVisible();

    const currentUrl = page.url();
    const parts = currentUrl.split('/');
    const id = parts[parts.length - 1];
    expect(id).not.toBe('');
    agent.setWorkspaceId(id);
  });

  test('can create doc', async ({ page }) => {
    await page.goto(agent.web.workspaceUrl);
    await page.getByRole('button', { name: 'Create' }).hover();
    await page.getByText('Block Document').click();
    const title = page.locator('doc-title v-line div');
    await title.click();
    await title.fill('First Doc');
    await page.keyboard.press('Enter');

    const elements = await page.$$('.n-menu-item-content');
    expect(elements.length).toBe(1);
  });

  test.afterAll(() => agent.stop());
});
