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

  test('can create workspace', async ({ page }) => {
    await page.goto(agent.web.baseUrl);
    expect(await page.title()).toBe('Note App');

    await agent.web.createWorkspace(page, 'hello');
    await expect(page.getByText('Test Client')).toBeVisible();
  });

  test('can create doc', async ({ page }) => {
    await page.goto(agent.web.workspaceUrl);
    await agent.web.createDoc(page, 'First Doc');
    await agent.web.createDoc(page, 'Second Doc');
    await agent.web.createDoc(page, 'Third Doc');

    await agent.web.asserts.docCount(page, 3);
  });

  test('can auto save doc', async ({ page }) => {
    await page.goto(agent.web.workspaceUrl);
    await agent.web.asserts.docCount(page, 3);

    await agent.web.selectDoc(page, 'First Doc');
    await expect(page.getByText('Hello world!')).toBeVisible();
  });

  test.afterAll(() => agent.stop());
});
