import { registerAPI } from './api.js';
import { initWebDAVServer } from './drive.js';
import { initAppContext, initWSServer } from './utils.js';

const context = await initAppContext();

registerAPI(context);
initWSServer(context);
initWebDAVServer(context);
