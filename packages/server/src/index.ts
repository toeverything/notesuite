import { registerAPI } from './api.js';
import { initWebDAVServer } from './drive/drive.js';
import { initAppContext, initWSServer } from './utils.js';

const context = await initAppContext();

console.log('Server...', context.port);
registerAPI(context);
console.log('API registered');

initWSServer(context);
console.log('WebSocket server started');

initWebDAVServer(context);
