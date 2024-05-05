import * as vscode from "vscode";

type EventType = void | vscode.TreeItem | vscode.TreeItem[] | null | undefined;

export class NoteListDataProvider
  implements vscode.TreeDataProvider<NoteListItem>
{
  private _notes: string[] = [];

  private _treeEventEmitter: vscode.EventEmitter<EventType> =
    new vscode.EventEmitter();

  onDidChangeTreeData = this._treeEventEmitter.event;

  getTreeItem(element: NoteListItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: NoteListItem): Thenable<NoteListItem[]> {
    return Promise.resolve(
      this._notes.map(
        (note) => new NoteListItem(note, "notesuite.openBlockEditor")
      )
    );
  }

  refresh(notes: string[]) {
    this._notes = notes;
    this._treeEventEmitter.fire();
  }
}

export class NoteListItem extends vscode.TreeItem {
  constructor(label: string, commandId: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = { command: commandId, title: label, arguments: [] };
  }
}
