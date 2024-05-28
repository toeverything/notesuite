import * as Ystream from '@y/stream';
import * as wscomm from '@y/stream/comms/websocket';
import * as authentication from '@y/stream/api/authentication';
import { createWSServer } from '@y/stream/comms/websocket-server';
import {
  collectionDef,
  testServerIdentity,
  testUser,
} from './auth.js';

const dbname = `./.db-ystream-${process.env.INSTANCE_NAME}`;

const remoteServer = await createWSServer({
  port: 9000,
  dbname,
  identity: testServerIdentity,
});

// const comm = new wscomm.WebSocketComm('ws://localhost:9000', collectionDef);
// await Ystream.remove(dbname);
const ystream = await Ystream.open(dbname, {
  // comms: [comm],
});
await authentication.registerUser(ystream, testServerIdentity.user, {
  isTrusted: true,
});
await authentication.setUserIdentity(
  ystream,
  testUser.user,
  await testUser.user.publicKey,
  testUser.privateKey
);

const { owner, name } = collectionDef;
const collection = ystream.getCollection(owner, name) as Ystream.Collection;


export async function getYDoc(id: string) {
  const ydoc = collection.getYdoc(id);
  await ydoc.whenLoaded;
  return ydoc;
}
