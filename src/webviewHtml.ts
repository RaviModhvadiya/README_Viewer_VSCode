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
        `class="toc-link block truncate opacity-80 hover:opacity-100 border-l-2 border-transparent pl-2 py-0.5 no-underline">` +
        `${escapeHtml(entry.text)}</a>`
      );
    })
    .join('');
}

/**
 * Builds the full webview HTML shell.
 *
 * NOTE on the signature: the brief asked for `(markdownText, cspNonce)`. Two more
 * parameters are added here — `cspSource` (needed to build a real CSP; there is no
 * safe placeholder for it) and `toc` / `fileName` (needed to render the outline
 * panel and header on first paint, before any postMessage round-trip happens).
 * `markdownText` is the *already-rendered* HTML from the extension's single
 * markdown pipeline, not raw markdown — parsing stays out of the webview so
 * there's exactly one source of truth for how `.md` becomes HTML.
 */
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
  style-src 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com ${cspSource};
  script-src 'nonce-${cspNonce}' https://cdn.tailwindcss.com https://unpkg.com;
  font-src https://unpkg.com data:;
  connect-src https:;
" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fileName)}</title>

<!-- Tailwind: lightweight CDN/JIT build, scoped by CSP nonce + host allow-list -->
<script nonce="${cspNonce}" src="https://cdn.tailwindcss.com"></script>
<!-- @vscode/webview-ui-toolkit, loaded as an ES module for theme-native components -->
<script nonce="${cspNonce}" type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit/dist/toolkit.min.js"></script>

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
  html, body { height: 100%; margin: 0; padding: 0; }
  body {
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
  }
  a { color: var(--vscode-textLink-foreground); }
  a:hover { color: var(--vscode-textLink-activeForeground); }
  code, pre { font-family: var(--vscode-editor-font-family); background: var(--vscode-textCodeBlock-background); }
  pre { padding: 0.75rem; border-radius: 6px; overflow-x: auto; }
  code { padding: 0.1rem 0.3rem; border-radius: 4px; }
  blockquote {
    border-left: 3px solid var(--vscode-textBlockQuote-border);
    background: var(--vscode-textBlockQuote-background);
    margin: 0; padding: 0.25rem 1rem;
  }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid var(--vscode-panel-border); padding: 0.4rem 0.6rem; }
  hr { border: none; border-top: 1px solid var(--vscode-panel-border); }
  ::selection { background: var(--vscode-editor-selectionBackground); }
  .toc-link.active {
    color: var(--vscode-textLink-activeForeground);
    font-weight: 600;
    border-left-color: var(--vscode-focusBorder) !important;
  }
  .task-checkbox { accent-color: var(--vscode-focusBorder); }
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
      <header class="flex items-center justify-between px-4 py-2 border-b border-[var(--vscode-panel-border)]">
        <div class="flex items-center gap-2 min-w-0">
          <button id="toc-expand-btn" class="hidden text-xs opacity-60 hover:opacity-100" title="Show outline">&raquo;</button>
          <span id="doc-title" class="font-semibold truncate">${escapeHtml(fileName)}</span>
        </div>
        <div id="status-badge" class="text-xs opacity-60"></div>
      </header>

      <div id="error-banner" class="hidden bg-[var(--vscode-inputValidation-errorBackground)] border-b border-[var(--vscode-inputValidation-errorBorder)] text-[var(--vscode-inputValidation-errorForeground)] px-4 py-2 text-sm"></div>

      <article id="content" class="flex-1 overflow-y-auto px-6 py-4 max-w-3xl fade-in">${markdownText}</article>
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
        'class="toc-link block truncate opacity-80 hover:opacity-100 border-l-2 border-transparent pl-2 py-0.5 no-underline">' +
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
      if (statusBadgeEl.textContent === text) {
        statusBadgeEl.textContent = '';
      }
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
        void contentEl.offsetWidth; // restart the animation
        contentEl.classList.add('fade-in');
        renderToc(message.toc);
        docTitleEl.textContent = message.fileName;
        setErrorBanner(null);
        wireCheckboxes();
        wireExternalLinks();
        wireTocScrollSpy();
        flashStatus('Updated');
        break;
      case 'themeChanged':
        document.body.setAttribute('data-vscode-theme-kind', message.kind);
        break;
      case 'error':
        setErrorBanner(message.message);
        break;
      default:
        break;
    }
  });

  wireCheckboxes();
  wireExternalLinks();
  wireTocScrollSpy();

  vscode.postMessage({ type: 'ready' });
})();
</script>
</body>
</html>`;
}