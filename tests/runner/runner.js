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
   * @param {number} port - The port on which to start the server.
   * @returns {Promise<void>}
   */
  async startServer(port) {
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn(
        'pnpm',
        ['--filter', '@notesuite/server', 'start'],
        {
          env: { ...process.env, PORT: port.toString() },
          stdio: 'inherit',
        }
      );

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
   * Start the web server.
   * @param {number} webPort - The port on which to start the web server.
   * @param {number} backendPort - The backend server port.
   * @returns {Promise<void>}
   */
  async startWeb(webPort, backendPort) {
    return new Promise((resolve, reject) => {
      this.webProcess = spawn('pnpm', ['dev:web'], {
        env: {
          ...process.env,
          VITE_PORT: webPort.toString(),
          BACKEND_URL: `localhost:${backendPort}`,
        },
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

  stop() {
    if (this.serverProcess) {
      this.serverProcess.kill();
    }
    if (this.webProcess) {
      this.webProcess.kill();
    }
  }
}
