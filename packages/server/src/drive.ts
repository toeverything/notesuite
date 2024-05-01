import { v2 as webdav } from 'webdav-server';
import * as Y from 'yjs';
import { CollabFS } from '@notesuite/common/dist/index.js';
import type { AppContext } from './utils.js';

function getIndexId(context: AppContext) {
  const id = context.db.data.activeWorkspaceId;
  if (!id) throw new Error('Active workspace not found');
  return id;
}

export function initWebDAVServer(context: AppContext) {
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

  server.rootFileSystem().addSubTree(
    server.createExternalContext(),
    {
      folder1: {
        'file1.txt': webdav.ResourceType.File,
        folder2: {
          'file2.txt': webdav.ResourceType.File,
        },
      },
      'root.txt': webdav.ResourceType.File,
    },
    () => {}
  );

  const indexId = getIndexId(context);
  const indexDoc = new Y.Doc();
  const client = new CollabFS({
    endpoint: 'localhost:3000',
    indexId,
    indexDoc,
  });
  client.on('indexSynced', () => {
    console.log('Index synced');
    server.start(() => {
      console.log('WebDAV server started on http://localhost:1900');
    });
  });
}
