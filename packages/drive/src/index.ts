import { v2 as webdav } from 'webdav-server';

const server = new webdav.WebDAVServer();

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
