
import { defineAPI } from './api.js';
import { initWebDAVServer } from './drive.js';
import { initAppContext, initWSServer } from './utils.js';

const context = await initAppContext();

defineAPI(context);
initWSServer(context);
initWebDAVServer(context);
