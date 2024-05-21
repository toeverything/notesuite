// @ts-check
import { spawn } from 'child_process';
import readline from 'readline';

export class AppRunner {
  /** @param {string} name */
  constructor(name = '') {
    this.environment = name;
    this.serverProcess = null;
    this.webProcess = null;
  }

  /**
   * @param {number} port
   * @param {string} instanceName
   * @returns {Promise<void>}
   */
  async startServer(port, instanceName = '') {
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('node', ['src/index.ts'], {
        env: {
          ...process.env,
          INSTANCE_NAME: instanceName,
          PORT: port.toString(),
          NODE_OPTIONS: '--import=./register.js',
        },
        cwd: 'packages/server',
        stdio: 'inherit',
      });

      this.serverProcess.on('error', err => reject(err));
      this.serverProcess.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Server process exited with code ${code}`));
        }
      });

      setTimeout(resolve, 2000);
    });
  }

  /**
   * @param {number} webPort
   * @param {number} backendPort
   * @returns {Promise<void>}
   */
  async startWeb(webPort, backendPort) {
    return new Promise((resolve, reject) => {
      this.webProcess = spawn('node_modules/.bin/vite', [], {
        env: {
          VITE_PORT: webPort.toString(),
          BACKEND_URL: `localhost:${backendPort}`,
          ...process.env,
        },
        cwd: 'packages/client',
        stdio: 'inherit',
      });
      this.webProcess.on('error', err => reject(err));
      this.webProcess.on('close', code => {
        if (code !== 0) {
          reject(new Error(`Web process exited with code ${code}`));
        }
      });

      setTimeout(resolve, 2000);
    });
  }

  waitForExit() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log('Press Ctrl+C to stop the servers...');
    process.on('SIGINT', () => {
      console.log('Caught interrupt signal');
      rl.close();
      this.stop();
      process.exit(0);
    });

    // Keep the process running
    rl.on('line', () => {});
  }

  async stop() {
    await Promise.all([
      this._terminateProcess(this.serverProcess, 'server'),
      this._terminateProcess(this.webProcess, 'web'),
    ]);
  }

  _terminateProcess(process, name) {
    return new Promise((resolve, reject) => {
      process.on('close', () => resolve());
      process.on('error', () => reject());
      process.kill('SIGINT');
    });
  }
}
