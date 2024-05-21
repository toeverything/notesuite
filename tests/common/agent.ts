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
