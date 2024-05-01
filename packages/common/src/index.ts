import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ObservableV2 } from 'lib0/observable';
// @ts-ignore
import { WebSocket } from './polyfill.cjs';

interface Options {
  endpoint: string;
  indexId: string;
  indexDoc: Y.Doc;
  interval?: number;
}

interface CollabFSEvents {
  indexSynced: (id: string) => void;
}

export class CollabFS extends ObservableV2<CollabFSEvents> {
  private options: Options;
  private indexDoc: Y.Doc;
  private activeDoc: Y.Doc | null = null;
  private docs: Map<string, Y.Doc> = new Map();
  private indexProvider: WebsocketProvider;
  private activeDocProvider: WebsocketProvider | null = null;
  private updatedDocs = new Set<Y.Doc>();
  private syncIntervalId: number;

  constructor(options: Options) {
    super();
    this.options = options;
    this.indexDoc = options.indexDoc;
    this.indexProvider = new WebsocketProvider(
      `ws://${options.endpoint}`,
      options.indexId,
      options.indexDoc,
      {
        WebSocketPolyfill: WebSocket,
      }
    );
    this.indexProvider.on('sync', () => {
      this.emit('indexSynced', [options.indexId]);
    });
    this.syncIntervalId = setInterval(() => {
      // this.syncInactiveDocs();
    }, this.options.interval || 3000);
  }

  async connectDoc(doc: Y.Doc, id: string) {
    this.docs.set(id, doc);
    this.updatedDocs.add(doc);
  }

  async setActiveDoc(doc: Y.Doc) {
    if (this.activeDoc === doc) return;

    if (this.activeDocProvider) {
      this.activeDocProvider.destroy();
      this.activeDocProvider = null;
    }
    this.activeDoc = doc;
    this.activeDocProvider = new WebsocketProvider(
      `ws://${this.options.endpoint}`,
      doc.guid,
      doc
    );
  }

  markUpdate(id: string) {
    const doc = this.docs.get(id);
    if (doc) {
      this.updatedDocs.add(doc);
    } else {
      console.error('Doc not found:', id);
    }
  }

  destroy() {
    clearInterval(this.syncIntervalId);
    this.indexProvider.destroy();
    if (this.activeDocProvider) {
      this.activeDocProvider.destroy();
    }
    this.docs.clear();
  }

  private async syncInactiveDocs() {
    const queue = this.updatedDocs.values();
    this.updatedDocs.clear();

    for (const doc of queue) {
      if (doc !== this.activeDoc) {
        await this.syncDoc(doc);
      }
    }
  }

  async syncDoc(doc: Y.Doc) {
    const currentState = Y.encodeStateAsUpdate(doc);

    const { endpoint } = this.options;
    const response = await fetch(`http://${endpoint}/api/sync/${doc.guid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: new Uint8Array(currentState),
    });

    if (response.ok) {
      const updateForClient = new Uint8Array(await response.arrayBuffer());
      console.log(
        `%capplyUpdate%c to ${doc.guid} with length ${updateForClient.length}`,
        'color: green; font-weight: bold;',
        'color: inherit;'
      );
      Y.applyUpdate(doc, updateForClient);
    }
  }
}
