export function initConnection() {
  const dom = <HTMLPreElement>document.getElementById('content')!;
  const json = JSON.parse(dom.textContent || '{}');
  return json.id as string;
}

export function initDarkMode() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (!isDark) return;

  const html = document.querySelector('html')!;
  html.dataset.theme = 'dark';
  html.classList.add('dark');
}
