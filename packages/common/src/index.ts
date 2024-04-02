import '@blocksuite/presets/themes/affine.css';
import { AffineEditorContainer } from '@blocksuite/presets';
import { Doc, Schema } from '@blocksuite/store';
import { DocCollection } from '@blocksuite/store';
import { AffineSchemas } from '@blocksuite/blocks';

export { Doc, DocCollection } from '@blocksuite/store';
export { AffineEditorContainer } from '@blocksuite/presets';

export function initWorkspaceContext() {
  const schema = new Schema().register(AffineSchemas);
  const collection = new DocCollection({ schema });
  const editor = new AffineEditorContainer();
  return { editor, collection };
}

export function initEmptyDoc(
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
