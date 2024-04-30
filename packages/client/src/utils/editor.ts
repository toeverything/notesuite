import '@blocksuite/presets/themes/affine.css';
import { AffineEditorContainer } from '@blocksuite/presets';
import { DocCollection, Doc, Schema } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';
import { CollabFS } from '@notesuite/common';

// direct importing in vue components meets error in vscode
export { AffineSchemas } from '@blocksuite/blocks';
export { DocCollection, Schema } from '@blocksuite/store';
export { AffineEditorContainer } from '@blocksuite/presets';

export function initWorkspaceContext(id: string) {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ id, schema });
  const editor = new AffineEditorContainer();

  const client = new CollabFS({
    endpoint: 'localhost:3000',
    indexId: id,
    indexDoc: collection.doc,
  });
  client.slots.indexSynced.on(() => client.debug());
  return { editor, collection, client };
}

export function createInitialDoc(
  editor: AffineEditorContainer,
  collection: DocCollection
) {
  const doc = collection.createDoc();
  doc.load(() => {
    const pageBlockId = doc.addBlock('affine:page', {});
    doc.addBlock('affine:surface', {}, pageBlockId);
    const noteId = doc.addBlock('affine:note', {}, pageBlockId);
    doc.addBlock('affine:paragraph', {}, noteId);
  });

  editor.doc = doc;
  editor.slots.docLinkClicked.on(({ docId }) => {
    const target = <Doc>collection.getDoc(docId);
    editor.doc = target;
  });
}
