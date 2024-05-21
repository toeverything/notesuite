import { registerAPI } from './api.js';
import { initWebDAVServer } from './drive/drive.js';
import { initAppContext, initWSServer } from './utils.js';

console.log('Starting server...');
console.log('NODE_OPTIONS:', process.env.NODE_OPTIONS);
console.log(111);

const context = await initAppContext();

console.log('Server...', context.port);
registerAPI(context);
console.log('API registered');

initWSServer(context);
console.log('WebSocket server started');

initWebDAVServer(context);
