import * as vscode from 'vscode';

type EventType = void | vscode.TreeItem | vscode.TreeItem[] | null | undefined;

export class NoteListDataProvider
  implements vscode.TreeDataProvider<NoteListItem>
{
  private _items: { id: string; name: string }[] = [];

  private _treeEventEmitter: vscode.EventEmitter<EventType> =
    new vscode.EventEmitter();

  onDidChangeTreeData = this._treeEventEmitter.event;

  getTreeItem(element: NoteListItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: NoteListItem): Thenable<NoteListItem[]> {
    return Promise.resolve(
      this._items.map(note => new NoteListItem(note.name, note.id))
    );
  }

  refresh(items: { id: string; name: string }[]) {
    this._items = items;
    this._treeEventEmitter.fire();
  }
}

export class NoteListItem extends vscode.TreeItem {
  constructor(label: string, id: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command: 'notesuite.openBlockEditor',
      title: label,
      arguments: [id],
    };
  }
}
