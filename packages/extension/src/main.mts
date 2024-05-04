import * as Y from 'yjs';
import type { NoteListDataProvider } from './utils.js';

export const collection = 'my-notes-app';

export async function init(provider: NoteListDataProvider, path: string) {
  const yroot = new Y.Doc();
  const ynotes = yroot.getArray('notes');
  ynotes.observeDeep(() => {
    const names = ynotes.toJSON().map(a => a.name) as string[];
    console.log(names);
    provider.refresh(names);
  });
  return { yroot, ynotes };
}
