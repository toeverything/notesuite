import { v2 as webdav } from 'webdav-server';
import * as Y from 'yjs';
import { CollabFS, IndexItem } from '@notesuite/common/dist/index.js';
import type { AppContext } from './utils.js';

function getWorkspace(context: AppContext) {
  const id = context.db.data.activeWorkspaceId;
  if (!id) throw new Error('Active workspace not found');
  const name =
    context.db.data.workspaces.find(w => w.id === id)?.name || 'untitled';
  return { id, name };
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setFileList(
  server: webdav.WebDAVServer,
  workspaceName: string,
  index: IndexItem[]
) {
  const vfs = new webdav.VirtualFileSystem();

  for (const item of index) {
    vfs.addSubTree(
      server.createExternalContext(),
      {
        [item.name + '.doc.json']: webdav.ResourceType.File,
      },
      () => {}
    );
  }

  server.setFileSystem(`/${workspaceName}`, vfs, success => {
    console.log('Virtual file system mounted:', success);
  });
}

export async function initWebDAVServer(context: AppContext) {
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

  const { id, name } = getWorkspace(context);
  const indexDoc = new Y.Doc();
  const client = new CollabFS({
    endpoint: 'localhost:3000',
    indexId: id,
    indexDoc,
  });

  client.on('indexSynced', () => {
    setFileList(server, name, client.index);
    server.start(() => {
      console.log('WebDAV server started on http://localhost:1900');
    });
  });
}
