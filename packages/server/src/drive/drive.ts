import { v2 as webdav } from 'webdav-server';
import * as Y from 'yjs';
import { YfsClient, IndexItem } from '@notesuite/common/dist/index.js';
import type { AppContext } from '../utils.js';
import { WebFileSystem } from './fs.js';

function getWorkspace(context: AppContext) {
  const id = context.db.data.activeWorkspaceId ?? '';
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
  server.setFileSystemAsync(`/${workspaceName}`, vfs);

  for (const item of index) {
    server.setFileSystemSync(
      `/${workspaceName}/${item.name}.doc.json`,
      new WebFileSystem(`http://localhost:3000/api/doc/${item.id}`)
    );
  }
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
  if (!id) {
    console.log('No active workspace, WebDAV server not started');
    return;
  }

  const indexDoc = new Y.Doc();
  const endpoint = `localhost:${context.port}`;

  const client = new YfsClient({
    endpoint,
    indexId: id,
    indexDoc,
  });

  client.on('indexSynced', () => {
    setFileList(server, name, client.index);
    server.start(() => console.log(`WebDAV server started on ${endpoint}`));
  });
}
