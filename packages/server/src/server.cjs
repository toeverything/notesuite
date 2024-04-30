// @ts-check

const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bodyParser = require('body-parser');
const Y = require('yjs');
const { setupWSConnection, docs, getYDoc } = require('y-websocket/bin/utils');

const app = express();
const port = parseInt(process.env.PORT || '3000');
const wss = new WebSocketServer({ noServer: true });
const server = app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

const adapter = new FileSync('db.json');
const db = low(adapter);
/** @type {{workspaces: {id: string, rootId: string, name: string}[]}} */
const defaultData = { workspaces: [] };
db.defaults(defaultData).write();

app.use(express.static('./'));
app.use(cors());
app.use(bodyParser.raw({ type: 'application/octet-stream' }));
app.use(express.json());

app.get('/api/workspaces', (req, res) => {
  const workspaces = db.get('workspaces');
  res.send(workspaces);
});

app.post('/api/workspaces', async (req, res) => {
  const { name } = req.body;
  const id = `${Date.now()}`;
  const rootId = id;
  const workspaces = db.get('workspaces');
  // @ts-ignore
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
