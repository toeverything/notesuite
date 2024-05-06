import { v2 as webdav } from 'webdav-server';
import { Readable } from 'stream';
import request from 'request';

class WebFileSystemSerializer implements webdav.FileSystemSerializer {
  uid(): string {
    return 'WebFileSystemSerializer_1.0.0';
  }

  serialize(fs: WebFileSystem, callback: webdav.ReturnCallback<any>): void {
    callback(undefined, {
      url: fs.url,
      props: fs.props,
    });
  }

  unserialize(
    serializedData: any,
    callback: webdav.ReturnCallback<WebFileSystem>
  ): void {
    const fs = new WebFileSystem(serializedData.url);
    fs.props = new webdav.LocalPropertyManager(serializedData.props);
    callback(undefined, fs);
  }
}

export class WebFileSystem extends webdav.FileSystem {
  props: webdav.IPropertyManager;
  locks: webdav.ILockManager;

  constructor(public url: string) {
    super(new WebFileSystemSerializer());

    this.props = new webdav.LocalPropertyManager();
    this.locks = new webdav.LocalLockManager();
  }

  _fastExistCheck(
    ctx: webdav.RequestContext,
    path: webdav.Path,
    callback: (exists: boolean) => void
  ): void {
    callback(path.isRoot());
  }

  _openReadStream(
    path: webdav.Path,
    info: webdav.OpenReadStreamInfo,
    callback: webdav.ReturnCallback<Readable>
  ): void {
    const stream = request.get(this.url);
    stream.end();
    callback(undefined, stream as any as Readable);
  }

  _propertyManager(
    path: webdav.Path,
    info: webdav.PropertyManagerInfo,
    callback: webdav.ReturnCallback<webdav.IPropertyManager>
  ): void {
    callback(undefined, this.props);
  }

  _lockManager(
    path: webdav.Path,
    info: webdav.LockManagerInfo,
    callback: webdav.ReturnCallback<webdav.ILockManager>
  ): void {
    callback(undefined, this.locks);
  }

  _type(
    path: webdav.Path,
    info: webdav.TypeInfo,
    callback: webdav.ReturnCallback<webdav.ResourceType>
  ): void {
    callback(undefined, webdav.ResourceType.File);
  }
}
