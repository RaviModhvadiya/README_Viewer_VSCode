export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTocHtml(toc: TocEntry[]): string {
  if (!toc.length) {
    return '<span class="opacity-50 text-xs">No headings found</span>';
  }
  const minLevel = Math.min(...toc.map((t) => t.level));
  return toc
    .map((entry) => {
      const indent = (entry.level - minLevel) * 12;
      return (
        `<a href="#${entry.slug}" data-slug="${entry.slug}" style="margin-left:${indent}px" ` +
        `class="toc-link block truncate opacity-80 hover:opacity-100 border-l-2 border-transparent pl-2 py-1 no-underline">` +
        `${escapeHtml(entry.text)}</a>`
      );
    })
    .join('');
}

export function getWebviewContent(
  markdownText: string,
  cspNonce: string,
  cspSource: string,
  toc: TocEntry[] = [],
  fileName = 'README.md'
): string {
  const tocHtml = renderTocHtml(toc);

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  img-src ${cspSource} https: data:;
  style-src 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com https://fonts.googleapis.com ${cspSource};
  script-src 'nonce-${cspNonce}' https://cdn.tailwindcss.com https://unpkg.com;
  font-src https://unpkg.com https://fonts.gstatic.com data:;
  connect-src https:;
" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fileName)}</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">

<script nonce="${cspNonce}" src="https://cdn.tailwindcss.com"></script>
<script nonce="${cspNonce}" type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit/dist/toolkit.min.js"></script>
<script nonce="${cspNonce}" src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"></script>
<link id="hljs-light-theme" rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github.min.css" disabled />
<link id="hljs-dark-theme" rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css" disabled />

<script nonce="${cspNonce}">
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          vsForeground: 'var(--vscode-editor-foreground)',
          vsBackground: 'var(--vscode-editor-background)',
          vsLink: 'var(--vscode-textLink-foreground)',
          vsBorder: 'var(--vscode-panel-border)',
          vsAccent: 'var(--vscode-focusBorder)'
        }
      }
    }
  };
</script>

<style nonce="${cspNonce}">
  :root {
    --accent-a: #8b5cf6;
    --accent-b: #22d3ee;
    --accent-c: #f472b6;
    --accent-gradient: linear-gradient(90deg, var(--accent-a), var(--accent-b) 55%, var(--accent-c));
  }

  html { scroll-behavior: smooth; }
  html, body { height: 100%; margin: 0; padding: 0; }
  body {
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: 'Inter', var(--vscode-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: var(--vscode-font-size);
    line-height: 1.65;
  }
  a { color: var(--vscode-textLink-foreground); }
  a:hover { color: var(--vscode-textLink-activeForeground); }
  ::selection { background: var(--vscode-editor-selectionBackground); }

  /* ---- Custom scrollbars ---- */
  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--vscode-scrollbarSlider-background); border-radius: 6px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--vscode-scrollbarSlider-hoverBackground); }

  /* ---- Content fills the full pane instead of a narrow fixed column ---- */
  #content {
    width: 100%;
    line-height: 1.75;
  }

  /* ---- Typography hierarchy ---- */
  #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
    font-family: 'Sora', var(--vscode-font-family), sans-serif;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1.9em;
    margin-bottom: 0.6em;
    scroll-margin-top: 1.5rem;
  }
  #content > h1:first-child, #content > h2:first-child { margin-top: 0; }

  #content h1 {
    font-size: 2.1rem;
    font-weight: 800;
    padding-bottom: 0.5em;
    position: relative;
  }
  #content h1::after {
    content: '';
    position: absolute;
    left: 0; bottom: 0;
    width: 72px; height: 4px;
    border-radius: 2px;
    background: var(--accent-gradient);
  }

  #content h2 {
    font-size: 1.5rem;
    padding-left: 0.75rem;
    border-left: 4px solid var(--accent-a);
  }
  #content h3 {
    font-size: 1.2rem;
    padding-left: 0.6rem;
    border-left: 3px solid var(--accent-b);
  }
  #content h4 {
    font-size: 1.05rem;
    padding-left: 0.5rem;
    border-left: 3px solid var(--accent-c);
  }
  #content h5, #content h6 {
    font-size: 0.9rem;
    opacity: 0.85;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  #content p { margin: 0.9em 0; }
  #content strong, #content b { font-weight: 700; }
  #content em, #content i { font-style: italic; }
  #content ul, #content ol { padding-left: 1.4em; margin: 0.7em 0; }
  #content ul { list-style: disc; }
  #content ol { list-style: decimal; }
  #content li { margin: 0.35em 0; }
  #content li > ul, #content li > ol { margin: 0.3em 0 0.3em 0.2em; }

  /* ---- Inline code + fenced code blocks ---- */
  #content code {
    font-family: 'JetBrains Mono', var(--vscode-editor-font-family), monospace;
    background: var(--vscode-textCodeBlock-background);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.88em;
  }
  .code-block-wrapper {
    position: relative;
    margin: 1.1em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--vscode-panel-border);
  }
  .code-block-wrapper::before {
    content: '';
    display: block;
    height: 3px;
    background: var(--accent-gradient);
  }
  .code-block-wrapper pre {
    margin: 0;
    padding: 0.9rem 1rem;
    overflow-x: auto;
  }
  .code-block-wrapper pre code {
    background: transparent;
    padding: 0;
    font-family: 'JetBrains Mono', var(--vscode-editor-font-family), monospace;
    font-size: 0.85em;
  }
  .code-copy-btn {
    position: absolute;
    top: 0.7rem;
    right: 0.6rem;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 5px;
    background: var(--vscode-button-secondaryBackground, rgba(255, 255, 255, 0.08));
    color: var(--vscode-button-secondaryForeground, var(--vscode-editor-foreground));
    border: 1px solid var(--vscode-panel-border);
    opacity: 0;
    transition: opacity 120ms ease, background 120ms ease, transform 120ms ease;
    cursor: pointer;
  }
  .code-block-wrapper:hover .code-copy-btn { opacity: 0.9; }
  .code-copy-btn:hover { opacity: 1 !important; transform: translateY(-1px); background: var(--vscode-button-secondaryHoverBackground, rgba(255, 255, 255, 0.15)); }

  /* ---- Blockquotes, tables, rules, images ---- */
  #content blockquote {
    border-left: 3px solid var(--accent-b);
    background: var(--vscode-textBlockQuote-background);
    margin: 1em 0;
    padding: 0.6rem 1.1rem;
    border-radius: 0 6px 6px 0;
    font-style: italic;
    opacity: 0.95;
  }
  #content table { border-collapse: collapse; width: 100%; margin: 1.1em 0; }
  #content th { background: var(--vscode-list-hoverBackground, rgba(255, 255, 255, 0.05)); text-align: left; font-weight: 700; }
  #content th, #content td { border: 1px solid var(--vscode-panel-border); padding: 0.55rem 0.8rem; }
  #content tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }
  #content tr:hover td { background: rgba(139, 92, 246, 0.06); }
  #content hr { border: none; height: 3px; border-radius: 2px; background: var(--accent-gradient); opacity: 0.4; margin: 2.2em 0; }
  #content img { max-width: 100%; border-radius: 8px; }

  /* ---- Links inside content get an animated gradient underline ---- */
  #content a {
    text-decoration: none;
    background-image: var(--accent-gradient);
    background-repeat: no-repeat;
    background-position: 0 100%;
    background-size: 0% 2px;
    transition: background-size 160ms ease;
    padding-bottom: 1px;
  }
  #content a:hover { background-size: 100% 2px; }

  /* ---- Task checkboxes ---- */
  .task-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--accent-a);
    margin-top: 0.2em;
    cursor: pointer;
    transition: transform 120ms ease;
  }
  .task-checkbox:active { transform: scale(0.85); }
  .task-checkbox:checked { filter: drop-shadow(0 0 4px var(--accent-a)); }

  /* ---- Table of contents ---- */
  .toc-link { transition: background 120ms ease, opacity 120ms ease, border-color 120ms ease; border-radius: 4px; }
  .toc-link.active {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.16), rgba(34, 211, 238, 0.08));
    color: var(--vscode-textLink-activeForeground);
    font-weight: 600;
    border-left-color: var(--accent-a) !important;
  }

  #toc-panel { font-family: 'Inter', var(--vscode-font-family), sans-serif; }

  .fade-in { animation: fadeIn 160ms ease-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
</style>
</head>
<body class="h-full">
  <div class="flex h-full">
    <aside id="toc-panel" class="hidden md:flex flex-col w-64 shrink-0 border-r border-[var(--vscode-panel-border)] overflow-y-auto p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs uppercase tracking-wide opacity-60">Contents</span>
        <button id="toc-collapse-btn" class="text-xs opacity-60 hover:opacity-100" title="Hide outline">&laquo;</button>
      </div>
      <nav id="toc-list" class="flex flex-col gap-0.5 text-sm">${tocHtml}</nav>
    </aside>

    <main class="flex-1 flex flex-col min-w-0">
      <header class="flex items-center justify-between px-5 py-2.5 border-b border-[var(--vscode-panel-border)]">
        <div class="flex items-center gap-2 min-w-0">
          <button id="toc-expand-btn" class="hidden text-xs opacity-60 hover:opacity-100" title="Show outline">&raquo;</button>
          <span id="doc-title" class="font-semibold truncate" style="font-family:'Sora',var(--vscode-font-family),sans-serif;">${escapeHtml(fileName)}</span>
        </div>
        <div id="status-badge" class="text-xs opacity-60"></div>
      </header>

      <div id="error-banner" class="hidden bg-[var(--vscode-inputValidation-errorBackground)] border-b border-[var(--vscode-inputValidation-errorBorder)] text-[var(--vscode-inputValidation-errorForeground)] px-4 py-2 text-sm"></div>

      <article id="content" class="flex-1 overflow-y-auto px-6 md:px-12 lg:px-20 py-6 fade-in">${markdownText}</article>
    </main>
  </div>

<script nonce="${cspNonce}">
(function () {
  const vscode = acquireVsCodeApi();

  const contentEl = document.getElementById('content');
  const tocListEl = document.getElementById('toc-list');
  const tocPanelEl = document.getElementById('toc-panel');
  const tocCollapseBtn = document.getElementById('toc-collapse-btn');
  const tocExpandBtn = document.getElementById('toc-expand-btn');
  const docTitleEl = document.getElementById('doc-title');
  const errorBannerEl = document.getElementById('error-banner');
  const statusBadgeEl = document.getElementById('status-badge');

  function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderToc(toc) {
    if (!toc || toc.length === 0) {
      tocListEl.innerHTML = '<span class="opacity-50 text-xs">No headings found</span>';
      return;
    }
    const minLevel = Math.min.apply(null, toc.map(function (t) { return t.level; }));
    tocListEl.innerHTML = toc.map(function (entry) {
      const indent = (entry.level - minLevel) * 12;
      return '<a href="#' + entry.slug + '" data-slug="' + entry.slug + '" style="margin-left:' + indent + 'px" ' +
        'class="toc-link block truncate opacity-80 hover:opacity-100 border-l-2 border-transparent pl-2 py-1 no-underline">' +
        escapeHtml(entry.text) + '</a>';
    }).join('');
  }

  function setErrorBanner(message) {
    if (!message) {
      errorBannerEl.classList.add('hidden');
      errorBannerEl.textContent = '';
      return;
    }
    errorBannerEl.textContent = message;
    errorBannerEl.classList.remove('hidden');
  }

  function flashStatus(text) {
    statusBadgeEl.textContent = text;
    setTimeout(function () {
      if (statusBadgeEl.textContent === text) { statusBadgeEl.textContent = ''; }
    }, 1200);
  }

  function wireCheckboxes() {
    contentEl.querySelectorAll('.task-checkbox').forEach(function (box) {
      box.addEventListener('change', function (event) {
        const target = event.target;
        const index = Number(target.getAttribute('data-checkbox-index'));
        if (Number.isNaN(index)) { return; }
        vscode.postMessage({ type: 'toggleCheckbox', index: index, checked: target.checked });
        flashStatus('Saving...');
      });
    });
  }

  function wireExternalLinks() {
    contentEl.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        event.preventDefault();
        vscode.postMessage({ type: 'openExternal', href: anchor.getAttribute('href') });
      });
    });
  }

  function wireCodeBlocks() {
    contentEl.querySelectorAll('pre').forEach(function (pre) {
      if (pre.parentElement && pre.parentElement.classList.contains('code-block-wrapper')) { return; }

      const codeEl = pre.querySelector('code');
      if (window.hljs && codeEl) {
        try { window.hljs.highlightElement(codeEl); } catch (e) { /* best-effort */ }
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-btn';
      button.textContent = 'Copy';
      button.addEventListener('click', function () {
        const text = codeEl ? codeEl.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(function () {
          button.textContent = 'Copied!';
          setTimeout(function () { button.textContent = 'Copy'; }, 1200);
        }).catch(function () {
          button.textContent = 'Failed';
          setTimeout(function () { button.textContent = 'Copy'; }, 1200);
        });
      });
      wrapper.appendChild(button);
    });
  }

  function wireTocScrollSpy() {
    const headings = Array.prototype.slice.call(
      contentEl.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    );
    if (headings.length === 0 || !('IntersectionObserver' in window)) { return; }
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocListEl.querySelectorAll('.toc-link').forEach(function (link) { link.classList.remove('active'); });
          const match = tocListEl.querySelector('[data-slug="' + entry.target.id + '"]');
          if (match) { match.classList.add('active'); }
        }
      });
    }, { rootMargin: '0px 0px -70% 0px' });
    headings.forEach(function (heading) { observer.observe(heading); });
  }

  function syncHljsTheme() {
    const isDark = document.body.classList.contains('vscode-dark') || document.body.classList.contains('vscode-high-contrast');
    const lightLink = document.getElementById('hljs-light-theme');
    const darkLink = document.getElementById('hljs-dark-theme');
    if (lightLink) { lightLink.disabled = isDark; }
    if (darkLink) { darkLink.disabled = !isDark; }
  }

  tocListEl.addEventListener('click', function (event) {
    const link = event.target.closest('a[data-slug]');
    if (!link) { return; }
    event.preventDefault();
    const target = document.getElementById(link.getAttribute('data-slug'));
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });

  tocCollapseBtn.addEventListener('click', function () {
    tocPanelEl.classList.add('hidden');
    tocExpandBtn.classList.remove('hidden');
  });

  tocExpandBtn.addEventListener('click', function () {
    tocPanelEl.classList.remove('hidden');
    tocExpandBtn.classList.add('hidden');
  });

  window.addEventListener('message', function (event) {
    const message = event.data;
    switch (message.type) {
      case 'update':
        contentEl.innerHTML = message.html;
        contentEl.classList.remove('fade-in');
        void contentEl.offsetWidth;
        contentEl.classList.add('fade-in');
        renderToc(message.toc);
        docTitleEl.textContent = message.fileName;
        setErrorBanner(null);
        wireCheckboxes();
        wireExternalLinks();
        wireCodeBlocks();
        wireTocScrollSpy();
        flashStatus('Updated');
        break;
      case 'themeChanged':
        document.body.setAttribute('data-vscode-theme-kind', message.kind);
        syncHljsTheme();
        break;
      case 'error':
        setErrorBanner(message.message);
        break;
      default:
        break;
    }
  });

  const themeObserver = new MutationObserver(syncHljsTheme);
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  syncHljsTheme();

  wireCheckboxes();
  wireExternalLinks();
  wireCodeBlocks();
  wireTocScrollSpy();

  vscode.postMessage({ type: 'ready' });
})();
</script>
</body>
</html>`;
}