// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@blocksuite/presets/themes/affine.css';

import { initConnection, initDarkMode } from './utils.js';
import { WebsocketProvider } from '@notesuite/common';
import { createEmptyDoc, AffineEditorContainer } from '@blocksuite/presets';

initDarkMode();
const id = initConnection();

const { doc } = createEmptyDoc();
const editor = new AffineEditorContainer();
editor.doc = doc;
document.body.append(editor);

const url = `ws://${process.env.BACKEND_URL}`;
const provider = new WebsocketProvider(url, id, doc.spaceDoc);
provider.on('sync', () => doc.load());
// @ts-ignore
window.provider = provider;
