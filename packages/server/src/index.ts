
import { defineAPI } from './api.js';
import { initExpressApp, initWSServer } from './utils.js';

const { app, httpServer } = initExpressApp();

defineAPI(app);
initWSServer(httpServer);
