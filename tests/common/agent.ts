import { Page, expect } from 'playwright/test';
// @ts-ignore
import { AppRunner } from './runner.js';

interface StartOptions {
  name: string;
  webPort: number;
  backendPort: number;
}

class WebAgentInterface {
  constructor(private agent: TestAgent) {}

  get baseUrl() {
    return `http://localhost:${this.agent.options.webPort}`;
  }

  get workspaceUrl() {
    return `${this.baseUrl}/${this.agent.workspaceId}`;
  }

  asserts = {
    docCount: async (page: Page, count: number) => {
      const elements = await page.$$('.n-menu-item-content');
      expect(elements.length).toBe(count);
    },
  };

  async createWorkspace(page: Page, name: string) {
    await page.getByPlaceholder('Workspace name').click();
    await page.getByPlaceholder('Workspace name').fill(name);
    await page.getByRole('button', { name: 'Create' }).click();
    await expect(page.getByText('Test Client')).toBeVisible();

    const currentUrl = page.url();
    const parts = currentUrl.split('/');
    const id = parts[parts.length - 1];
    expect(id).not.toBe('');
    this.agent.setWorkspaceId(id);
  }

  async createDoc(page: Page, title: string) {
    await page.getByRole('button', { name: 'Create' }).hover();
    await page.getByText('Block Document').click();
    const titleElement = page.locator('doc-title v-line div');
    await titleElement.click();
    await titleElement.fill(title);
    await page.keyboard.press('Enter');
    await this.selectDoc(page, title);

    await page.locator('v-line > div').nth(1).click();
    await page.keyboard.type('Hello world!');
    await page.waitForTimeout(1000);
  }

  async selectDoc(page: Page, title: string) {
    await page.getByRole('menuitem').getByText(title).click();
  }
}

class MockAgentInterface {
  constructor(private agent: TestAgent) {}
}

export class TestAgent {
  runner = new AppRunner();
  web = new WebAgentInterface(this);
  mock = new MockAgentInterface(this);

  workspaceId = '';
  options = {
    name: '',
    webPort: 0,
    backendPort: 0,
  };

  async start(options: StartOptions) {
    this.options = options;
    await this.runner.clean();
    await Promise.all([
      this.runner.startServer(options.backendPort, options.name),
      this.runner.startWeb(options.webPort, options.backendPort),
    ]);
  }

  async stop() {
    await this.runner.stop();
  }

  setWorkspaceId(id: string) {
    this.workspaceId = id;
  }
}
