import * as Ystream from '@y/stream';
import * as wscomm from '@y/stream/comms/websocket';
import * as authentication from '@y/stream/api/authentication';
import { createWSServer } from '@y/stream/comms/websocket-server';
import {
  collectionDef,
  testServerIdentity,
  testUser,
} from './ystream/utils.js';

const dbname = './.db-ystream/test';

const server = await createWSServer({
  port: 9000,
  dbname,
  identity: testServerIdentity,
});

const comm = new wscomm.WebSocketComm('ws://localhost:9000', collectionDef);
// await Ystream.remove(dbname);
const ystream = await Ystream.open(dbname, {
  comms: [comm],
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
const collection = ystream.getCollection(owner, name);
const ydoc1 = collection.getYdoc('ydoc');
await ydoc1.whenLoaded;
// console.log(ydoc1);