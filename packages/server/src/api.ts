import * as Y from 'yjs';
// @ts-ignore
import { getYDoc } from './ystream/adaptor.js';
import type { AppContext } from './utils.js';
// import { exportSnapshot } from '@notesuite/common/dist/editor.js';

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

  app.get('/api/workspaces/active', (req, res) => {
    const activeWorkspaceId = db.data.activeWorkspaceId;
    res.send({ id: activeWorkspaceId });
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

  app.get('/api/doc/:id', async (req, res) => {
    const id = req.params.id;
    const ydoc = (await getYDoc(id)) as Y.Doc;
    ydoc.getMap('blocks');

    const json = ydoc.toJSON();
    json.id = id;

    res.setHeader('cache-control', 'no-store');
    res.send(JSON.stringify(json, null, 2));
  });

  app.post('/api/doc/sync/:id', async (req, res) => {
    const id = req.params.id;
    const roomDoc = (await getYDoc(id)) as Y.Doc;
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
