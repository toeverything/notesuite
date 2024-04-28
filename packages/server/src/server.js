// @ts-check

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { JSONFilePreset } from 'lowdb/node';
import { setupWSConnection, docs } from 'y-websocket/bin/utils';

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
app.use(express.json());

app.get('/api/workspaces', (req, res) => {
  const { workspaces } = db.data;
  res.send(workspaces);
});

app.post('/api/workspaces', async (req, res) => {
  const { name } = req.body;
  const id = `${Date.now()}`;
  const rootId = id;
  db.data.workspaces.push({ id, name, rootId });
  await db.write();
  res.status(201).send({ id, name, rootId });
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
