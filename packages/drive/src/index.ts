import { v2 as webdav } from 'webdav-server';

const userManager = new webdav.SimpleUserManager();
const privilegeManager = new webdav.SimplePathPrivilegeManager();

const user = userManager.addUser('guest', 'password', false);
privilegeManager.setRights(user, '/', ['canRead']);

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

server.start(() =>
  console.log('WebDAV server started on http://localhost:1900')
);
