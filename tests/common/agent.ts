// @ts-ignore
import { AppRunner } from './runner.js';

interface StartOptions {
  name: string;
  webPort: number;
  backendPort: number;
}

export class TestAgent {
  runner = new AppRunner();

  async start(options: StartOptions) {
    await Promise.all([
      this.runner.startServer(options.backendPort, options.name),
      this.runner.startWeb(options.webPort, options.backendPort),
    ]);
  }

  async stop() {
    await this.runner.stop();
  }
}
