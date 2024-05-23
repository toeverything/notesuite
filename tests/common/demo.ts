import { test } from 'playwright/test';
import { TestAgent } from './agent.js';

test('demo', async ({ page }) => {
  const agent = new TestAgent();
  await agent.start({
    name: 'default',
    webPort: 5173,
    backendPort: 3000,
  });
  await page.goto(agent.web.baseUrl);
  // await page.pause();

  await agent.web.createWorkspace(page, 'hello');
  await agent.web.createDoc(page, 'First Doc');
  await agent.web.createDoc(page, 'Second Doc');
  await agent.web.createDoc(page, 'Third Doc');
  // await page.pause();
  await agent.stop();
});
