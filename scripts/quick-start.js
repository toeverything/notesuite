// @ts-check
import { AppRunner } from '../tests/common/runner.js';

const runner = new AppRunner();
runner.startServer(3000);
runner.startWeb(5173, 3000);

runner.waitForExit();
