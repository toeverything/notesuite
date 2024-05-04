// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NoteListDataProvider, getWebviewContent } from './utils';

class MarkdownFileSystemProvider implements vscode.FileSystemProvider {
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

export async function activate(context: vscode.ExtensionContext) {
  const path = context.globalStorageUri.fsPath;
  console.log(`Extension "notesuite" is now active! Path: ${path}`);

  const noteListProvider = new NoteListDataProvider();
  vscode.window.registerTreeDataProvider('noteListView', noteListProvider);

  const { init } = await import('./main.mjs');
  await init(noteListProvider, path);

  context.subscriptions.push(
    vscode.commands.registerCommand('notesuite.openBlockEditor', () => {
      const panel = vscode.window.createWebviewPanel(
        'notesuite',
        'Block Editor',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );
      panel.webview.html = getWebviewContent();
    })
  );

  context.subscriptions.push(
    vscode.workspace.registerFileSystemProvider(
      'my-scheme',
      new MarkdownFileSystemProvider()
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      'notesuite.openNativeEditor',
      (document: vscode.TextDocument) => {
        const uri = vscode.Uri.parse(`my-scheme://${document.uri.path}`);
        vscode.window.showTextDocument(uri);
      }
    )
  );

  context.subscriptions.push(
    vscode.workspace.onWillSaveTextDocument(event => {
      if (
        event.document.languageId === 'markdown' &&
        event.document.uri.scheme === 'file'
      ) {
        vscode.window
          .showWarningMessage(
            'Your current editing is not synced. Please edit through local note server.',
            'Switch'
          )
          .then(() => {
            vscode.commands.executeCommand(
              'notesuite.openNativeEditor',
              event.document
            );
          });
      }
    })
  );

  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(document => {
      if (
        document.languageId === 'markdown' &&
        document.uri.scheme === 'file'
      ) {
        vscode.window
          .showInformationMessage(
            'Please edit this file through local note server.',
            'Switch'
          )
          .then(selection => {
            if (selection === 'Switch') {
              vscode.commands.executeCommand(
                'notesuite.openNativeEditor',
                document
              );
            }
          });
      } else if (document.uri.path.endsWith('.doc.json')) {
        vscode.window
          .showInformationMessage(
            'Use block editor to edit this file.',
            'Open Block Editor'
          )
          .then(selection => {
            if (selection === 'Open Block Editor') {
              vscode.commands.executeCommand('notesuite.openBlockEditor');
            }
          });
      }
    })
  );
}

export function deactivate() {}
