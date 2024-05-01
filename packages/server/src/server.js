// @ts-check

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { JSONFilePreset } from 'lowdb/node';
import bodyParser from 'body-parser';
import * as Y from 'yjs';
import { setupWSConnection, docs, getYDoc } from './third-party/y-websocket.js';

const app = express();
const port = parseInt(process.env.PORT || '3000');
const wss = new WebSocketServer({ noServer: true });
const server = app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

/** @type {{workspaces: {id: string, rootId: string, name: string}[]}} */
const defaultData = { workspaces: [] };
const db = await JSONFilePreset('./db.json', defaultData);
await db.read();
await db.write();

app.use(express.static('./'));
app.use(cors());
app.use(bodyParser.raw({ type: 'application/octet-stream' }));
app.use(express.json());

app.get('/api/workspaces', (req, res) => {
  const workspaces = db.data.workspaces;
  res.send(workspaces);
});

app.post('/api/workspaces', async (req, res) => {
  const { name } = req.body;
  const id = `${Date.now()}`;
  const rootId = id;
  const workspaces = db.data.workspaces;
  workspaces.push({ id, name, rootId });
  db.write();
  res.status(201).send({ id, name, rootId });
});

app.post('/api/sync/:id', (req, res) => {
  const id = req.params.id;
  const roomDoc = getYDoc(id);
  const clientUpdate = new Uint8Array(req.body);

  const tempDoc = new Y.Doc();
  Y.applyUpdate(tempDoc, clientUpdate);
  const clientStateVector = Y.encodeStateVector(tempDoc);
  const serverStateVector = Y.encodeStateVector(roomDoc);

  const diffClientNeeds = Y.diffUpdate(
    Y.encodeStateAsUpdate(roomDoc),
    clientStateVector
  );
  const diffServerNeeds = Y.diffUpdate(clientUpdate, serverStateVector);

  Y.applyUpdate(roomDoc, diffServerNeeds);
  tempDoc.destroy();

  res.type('application/octet-stream');
  res.send(Buffer.from(diffClientNeeds));
});

server.on('upgrade', (request, socket, head) => {
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
  console.log(docs);
});
