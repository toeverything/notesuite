// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import '@blocksuite/presets/themes/affine.css';

import { createEmptyDoc, AffineEditorContainer } from '@blocksuite/presets';
import { Text } from '@blocksuite/store';
import { initDarkMode } from './utils.js';

initDarkMode();

const doc = createEmptyDoc().init();
const editor = new AffineEditorContainer();
editor.doc = doc;
document.body.append(editor);

const paragraphs = doc.getBlockByFlavour('affine:paragraph');
const paragraph = paragraphs[0];
doc.updateBlock(paragraph, { text: new Text('Hello World!') });
