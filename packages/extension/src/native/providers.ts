import * as vscode from 'vscode';
import { getWebviewContent } from './webview';

type EventType = void | vscode.TreeItem | vscode.TreeItem[] | null | undefined;

export class MarkdownFileSystemProvider implements vscode.FileSystemProvider {
  onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> =
    new vscode.EventEmitter<vscode.FileChangeEvent[]>().event;

  readFile(uri: vscode.Uri): Uint8Array {
    console.log('readFile', uri.path);
    return new TextEncoder().encode('Hello World');
  }

  watch() {
    return { dispose() {} };
  }
  stat() {
    return {
      type: vscode.FileType.File,
      ctime: Date.now(),
      mtime: Date.now(),
      size: 1024,
    };
  }
  readDirectory() {
    return [];
  }
  createDirectory() {}
  writeFile() {}
  delete() {}
  rename() {}
}

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

class CustomDocument implements vscode.CustomDocument {
  uri: vscode.Uri;
  id: string;
  constructor(uri: vscode.Uri, id: string) {
    this.uri = uri;
    this.id = id;
  }
  dispose(): void {}
}

export class CustomEditorProvider implements vscode.CustomEditorProvider {
  constructor(private readonly context: vscode.ExtensionContext) {}
  private readonly onDidChangeCustomDocumentEmitter = new vscode.EventEmitter<
    vscode.CustomDocumentEditEvent<CustomDocument>
  >();
  public readonly onDidChangeCustomDocument =
    this.onDidChangeCustomDocumentEmitter.event;

  saveCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error('Method not implemented.');
  }
  saveCustomDocumentAs(
    document: vscode.CustomDocument,
    destination: vscode.Uri,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error('Method not implemented.');
  }
  revertCustomDocument(
    document: vscode.CustomDocument,
    cancellation: vscode.CancellationToken
  ): Thenable<void> {
    throw new Error('Method not implemented.');
  }
  backupCustomDocument(
    document: vscode.CustomDocument,
    context: vscode.CustomDocumentBackupContext,
    cancellation: vscode.CancellationToken
  ): Thenable<vscode.CustomDocumentBackup> {
    throw new Error('Method not implemented.');
  }
  async openCustomDocument(
    uri: vscode.Uri,
    openContext: { backupId?: string },
    token: vscode.CancellationToken
  ): Promise<CustomDocument> {
    const data = await vscode.workspace.fs.readFile(uri);
    const content = Buffer.from(data).toString('utf8');
    let id = '';
    try {
      const json = JSON.parse(content);
      id = json.id || '';
    } catch (error) {
      console.error('Failed to parse JSON file:', error);
      throw new Error('Failed to parse JSON file.');
    }
    return new CustomDocument(uri, id);
  }

  async resolveCustomEditor(
    document: CustomDocument,
    webviewPanel: vscode.WebviewPanel,
    token: vscode.CancellationToken
  ): Promise<void> {
    webviewPanel.webview.options = {
      enableScripts: true,
    };
    webviewPanel.webview.html = getWebviewContent('');

    webviewPanel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showErrorMessage(message.text);
          break;
      }
    });

    const { id } = document;
    webviewPanel.webview.postMessage({
      command: 'update',
      id,
    });
  }
}
