import * as vscode from 'vscode';
import {
  NoteListDataProvider,
  MarkdownFileSystemProvider,
  CustomEditorProvider,
} from './native/providers';
import { openWebview } from './native/webview';

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "notesuite" is now active!');

  const noteListProvider = new NoteListDataProvider();
  vscode.window.registerTreeDataProvider('noteListView', noteListProvider);

  const { initClient } = await import('./client.mjs');
  await initClient(noteListProvider);

  context.subscriptions.push(
    vscode.commands.registerCommand('notesuite.openBlockEditor', (id: string) =>
      openWebview(context, id)
    )
  );

  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      'BlockDocEditor',
      new CustomEditorProvider(context),
      {
        webviewOptions: {
          retainContextWhenHidden: true,
        },
        supportsMultipleEditorsPerDocument: true,
      }
    )
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
              const currentText = document.getText();
              const id = JSON.parse(currentText).id as string;
              vscode.commands.executeCommand('notesuite.openBlockEditor', id);
            }
          });
      }
    })
  );
}

export function deactivate() {}
