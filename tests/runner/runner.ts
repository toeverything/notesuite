// // @ts-check
// import { spawn, type ChildProcess } from 'child_process';
// import readline from 'readline';

export class AppRunner {
  environment: string;
  serverProcess: ChildProcess | null = null;
  webProcess: ChildProcess | null = null;

  constructor(name = '') {
    this.environment = name;
  }

  async startServer(port: number) {
    // return new Promise((resolve, reject) => {
    //   this.serverProcess = spawn(
    //     'pnpm',
    //     ['--filter', '@notesuite/server', 'start'],
    //     {
    //       env: { ...process.env, PORT: port.toString() },
    //       stdio: 'inherit',
    //     }
    //   );

    //   this.serverProcess.on('error', err => reject(err));
    //   this.serverProcess.on('close', code => {
    //     if (code !== 0) {
    //       reject(new Error(`Server process exited with code ${code}`));
    //     }
    //   });

    //   setTimeout(resolve, 2000);
    // });
  }

  async startWeb(webPort: number, backendPort: number) {
    // return new Promise((resolve, reject) => {
    //   this.webProcess = spawn('pnpm', ['dev:web'], {
    //     env: {
    //       ...process.env,
    //       VITE_PORT: webPort.toString(),
    //       BACKEND_URL: `localhost:${backendPort}`,
    //     },
    //     stdio: 'inherit',
    //   });

    //   this.webProcess.on('error', err => reject(err));
    //   this.webProcess.on('close', code => {
    //     if (code !== 0) {
    //       reject(new Error(`Web process exited with code ${code}`));
    //     }
    //   });

    //   setTimeout(resolve, 2000);
    // });
  }

  waitForExit() {
    // const rl = readline.createInterface({
    //   input: process.stdin,
    //   output: process.stdout,
    // });

    // console.log('Press Ctrl+C to stop the servers...');
    // process.on('SIGINT', () => {
    //   console.log('Caught interrupt signal');
    //   rl.close();
    //   this.stop();
    // });

    // // Keep the process running
    // rl.on('line', () => {});
  }

  async stop() {
    if (this.serverProcess) {
      await this._terminateProcess(this.serverProcess);
    }
    if (this.webProcess) {
      await this._terminateProcess(this.webProcess);
    }
  }

  _terminateProcess(process: ChildProcess) {
    return new Promise((resolve, reject) => {
      process.on('close', resolve);
      process.on('error', reject);
      process.kill();
    });
  }
}
