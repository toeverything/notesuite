import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Slot } from '@blocksuite/global/utils';

interface Options {
  endpoint: string;
  indexId: string;
  indexDoc: Y.Doc;
}

export class CollabFS {
  indexDoc: Y.Doc;
  slots = {
    indexSynced: new Slot(),
  };

  constructor({ endpoint, indexId, indexDoc }: Options) {
    this.indexDoc = indexDoc;
    const indexProvider = new WebsocketProvider(
      `ws://${endpoint}`,
      indexId,
      indexDoc
    );
    indexProvider.on('sync', () => this.slots.indexSynced.emit());
  }

  debug() {
    console.log(Y.encodeStateAsUpdate(this.indexDoc));
  }
}
