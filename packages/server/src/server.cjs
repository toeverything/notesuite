// @ts-check

const express = require('express');
const WebSocket = require('ws');
const { setupWSConnection, docs } = require('y-websocket/bin/utils');

const app = express();
const port = parseInt(process.env.PORT || '3000');
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, request) => {
  if (!request.url) return;
  console.log(docs);
  setupWSConnection(ws, request, { gc: true });
});

app.use(express.static('./'));
app.use((req, res, next) => {
  console.log(`Received request for ${req.url}`);
  next();
});

const server = app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

server.on('upgrade', (request, socket, head) => {
  if (!request.url) return;

  const { pathname } = new URL(request.url, `http://${request.headers.host}`);

  if (pathname.startsWith('/')) {
    wss.handleUpgrade(request, socket, head, ws => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});
