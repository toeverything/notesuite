import { Job, DocCollection, Schema } from '@blocksuite/store';
import * as Y from 'yjs';

// TODO
export async function exportSnapshot(ydoc: Y.Doc) {
  const schema = new Schema();
  const collection = new DocCollection({ schema });
  const doc = collection.createDoc({ id: ydoc.guid });
  const updates = Y.encodeStateAsUpdate(ydoc);
  Y.applyUpdate(doc.spaceDoc, updates);

  const job = new Job({ collection });
  const json = await job.docToSnapshot(doc);
  return json;
}
