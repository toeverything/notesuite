// @ts-check

const express = require('express');
const WebSocket = require('ws');
const { setupWSConnection, docs } = require('y-websocket/bin/utils');

const app = express();
const port = parseInt(process.env.PORT || '3000');
const wss = new WebSocket.Server({ noServer: true });
const server = app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);

app.use(express.static('./'));

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
