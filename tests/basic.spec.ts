import { expect, test } from 'playwright/test';
import { TestAgent } from './common/agent.js';

test.describe('basic test', () => {
  const agent = new TestAgent();

  test.beforeAll(() =>
    agent.start({
      name: 'test-basic',
      webPort: 5173,
      backendPort: 3000,
    })
  );

  test('local server works', async ({ page }) => {
    await page.goto('http://localhost:5173');
    const title = await page.title();
    expect(title).toBe('Note App');
  });

  test.afterAll(async () => await agent.stop());
});
