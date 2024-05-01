import { v2 as webdav } from 'webdav-server';
import * as Y from 'yjs';
import { CollabFS, IndexItem } from '@notesuite/common/dist/index.js';
import type { AppContext } from './utils.js';

function getIndexId(context: AppContext) {
  const id = context.db.data.activeWorkspaceId;
  if (!id) throw new Error('Active workspace not found');
  return id;
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setFileList(index: IndexItem[], server: webdav.WebDAVServer) {
  for (const item of index) {
    server.rootFileSystem().addSubTree(
      server.createExternalContext(),
      {
        [item.name + '.doc.json']: webdav.ResourceType.File,
      },
      () => {}
    );
  }
}

export async function initWebDAVServer(context: AppContext) {
  // XXX: wait for database ydocs
  await wait(1000);

  const userManager = new webdav.SimpleUserManager();
  const privilegeManager = new webdav.SimplePathPrivilegeManager();

  const defaultUser = userManager.addUser('guest', 'password', false);
  const anonymousUser = userManager.addUser('anonymous', '', false);
  privilegeManager.setRights(defaultUser, '/', ['canRead']);
  privilegeManager.setRights(anonymousUser, '/', ['canRead']);

  const httpAuthentication = new webdav.HTTPDigestAuthentication(
    userManager,
    'Default realm'
  );

  const server = new webdav.WebDAVServer({
    httpAuthentication,
    privilegeManager,
    requireAuthentification: false,
  });

  const indexId = getIndexId(context);
  const indexDoc = new Y.Doc();
  const client = new CollabFS({
    endpoint: 'localhost:3000',
    indexId,
    indexDoc,
  });

  client.on('indexSynced', () => {
    setFileList(client.index, server);
    server.start(() => {
      console.log('WebDAV server started on http://localhost:1900');
    });
  });
}
