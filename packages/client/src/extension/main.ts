// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@blocksuite/presets/themes/affine.css';

import { initDarkMode } from './utils.js';
import { WebsocketProvider } from '@notesuite/common';
import { createEmptyDoc, AffineEditorContainer } from '@blocksuite/presets';

const { doc } = createEmptyDoc();
const editor = new AffineEditorContainer();
editor.doc = doc;
document.body.append(editor);

// @ts-ignore
const idPromise = window.idPromise as Promise<id>;
const id = await idPromise;

const provider = new WebsocketProvider('ws://localhost:3000', id, doc.spaceDoc);
provider.on('sync', () => doc.load());
// @ts-ignore
window.provider = provider;
