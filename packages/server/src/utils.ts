import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { JSONFilePreset } from 'lowdb/node';
import type http from 'http';
// @ts-ignore
import { setupWSConnection, docs } from './third-party/y-websocket.js';

export function initExpressApp() {
  const app = express();
  app.use(express.static('./'));
  app.use(cors());
  app.use(bodyParser.raw({ type: 'application/octet-stream' }));
  app.use(express.json());

  const port = parseInt(process.env.PORT || '3000');
  const httpServer = app.listen(port, () =>
    console.log(`Server started on http://localhost:${port}`)
  );
  return { app, httpServer };
}

export async function initDB() {
  const defaultData: {
    workspaces: { id: string; rootId: string; name: string }[];
  } = { workspaces: [] };
  const db = await JSONFilePreset('./db.json', defaultData);
  await db.read();
  await db.write();
  return db;
}

export function initWSServer(httpServer: http.Server) {
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
    console.log([...docs.keys()]);
  });
}
