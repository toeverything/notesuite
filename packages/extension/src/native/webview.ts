import * as vscode from 'vscode';

export function getWebviewContent(id: string) {
  return /* html */ `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Block Editor</title>
    <style>
      html,
      body {
        height: 100%;
        overflow: hidden;
        margin: 0;
        padding: 0;
        background-color: var(--affine-white-90);
        transition: background-color 0.3s;
      }
    </style>
  </head>
  <body>
    <pre id="content" style="display:none;">{"id":"${id}"}</pre>
    <script>
const vscode = acquireVsCodeApi();

window.idPromise = new Promise((resolve) => {
  window.addEventListener('message', event => {
    const message = event.data;
    if (message.command === 'update') {
      resolve(message.id);
    }
  });
});
    </script>
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/src/extension/main.ts"></script>
  </body>
</html>
  `;
}

export function openWebview(context: vscode.ExtensionContext, id: string) {
  const panel = vscode.window.createWebviewPanel(
    'notesuite',
    'Block Editor',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );
  panel.webview.html = getWebviewContent(id);
}
