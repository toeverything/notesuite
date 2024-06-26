import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';
import type http from 'http';
import {
  setupWSConnection,
  docs as serverDocs,
  // @ts-ignore
} from './third-party/y-websocket.js';
import * as Y from 'yjs';
import { getYDoc } from './ystream/adaptor.js';

const instanceName = process.env.INSTANCE_NAME || 'default';
const docs = serverDocs as Map<string, Y.Doc>;

export interface AppContext {
  port: number;
  express: express.Express;
  httpServer: http.Server;
  docs: Map<string, Y.Doc>;
  db: Awaited<ReturnType<typeof initDB>>;
}

export async function initAppContext(): Promise<AppContext> {
  const app = express();
  app.use(express.static('./'));
  app.use(cors());
  app.use(bodyParser.raw({ type: 'application/octet-stream' }));
  app.use(express.json());

  const port = parseInt(process.env.PORT || '3000', 10);
  const httpServer = app.listen(port, () =>
    console.log(`HTTP server started on localhost:${port}`)
  );

  const db = await initDB();
  return { port, express: app, httpServer, db, docs };
}

async function initDB() {
  const defaultData: {
    activeWorkspaceId?: string;
    workspaces: { id: string; rootId: string; name: string }[];
  } = { workspaces: [] };
  const db = await JSONFilePreset(`./db-${instanceName}.json`, defaultData);
  await db.read();
  await db.write();
  return db;
}

export function initWSServer(context: AppContext) {
  const { httpServer } = context;
  const wss = new WebSocketServer({ noServer: true });
  httpServer.on('upgrade', (request, socket, head) => {
    const { url = '' } = request;
    const { pathname } = new URL(url, `http://${request.headers.host}`);

    if (pathname.startsWith('/')) {
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws, request) => {
    setupWSConnection(ws, request, { gc: true });
    // console.log('doc count', [...docs.keys()].length);
  });

  const { activeWorkspaceId } = context.db.data;
  if (activeWorkspaceId) {
    getYDoc(activeWorkspaceId);
  }
}
