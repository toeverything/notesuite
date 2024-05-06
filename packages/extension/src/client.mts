import * as Y from 'yjs';
import { CollabFS, IndexItem } from '@notesuite/common/dist/index.js';
import type { NoteListDataProvider } from './native/providers.js';

const host = 'localhost:3000';

export async function initClient(provider: NoteListDataProvider) {
  const indexDoc = new Y.Doc();
  const id = await fetch(`http://${host}/api/workspaces/active`)
    .then(res => res.json() as Promise<{ id: string }>)
    .then(res => res.id);

  const client = new CollabFS({
    endpoint: host,
    indexId: id,
    indexDoc,
  });

  client.on('indexSynced', () => {
    const items = client.index;
    console.log(items);
    provider.refresh(items);
  });
}
