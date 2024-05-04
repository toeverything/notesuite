import * as Y from 'yjs';
// @ts-ignore
import { getYDoc } from './third-party/y-websocket.js';
import type { AppContext } from './utils.js';

export function registerAPI(context: AppContext) {
  const { express: app, db } = context;

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

  app.put('/api/workspaces/active/:id', (req, res) => {
    const { id } = req.params;
    const workspaces = db.data.workspaces;

    if (!workspaces.some(ws => ws.id === id)) {
      res.status(404).send({ message: 'Workspace not found' });
      return;
    }

    db.data.activeWorkspaceId = id;
    db.write();
    res.status(200).send();
  });

  app.post('/api/sync/:id', async (req, res) => {
    const id = req.params.id;
    const roomDoc = await getYDoc(id);
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
}
