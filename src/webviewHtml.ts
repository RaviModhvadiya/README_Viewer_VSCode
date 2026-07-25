export interface TocEntry {
  level: number;
  text: string;
  slug: string;
}

export interface HighlightAssetUris {
  scriptUri: string;
  darkThemeUri: string;
  lightThemeUri: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderTocHtml(toc: TocEntry[]): string {
  if (!toc.length) {
    return '<span class="toc-empty">No headings found</span>';
  }
  const minLevel = Math.min(...toc.map((t) => t.level));
  return toc
    .map((entry) => {
      const indent = (entry.level - minLevel) * 12;
      return (
        `<a href="#${entry.slug}" data-slug="${entry.slug}" style="margin-left:${indent}px" class="toc-link">` +
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
  fileName = 'README.md',
  highlightAssets: HighlightAssetUris
): string {
  const tocHtml = renderTocHtml(toc);

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  img-src ${cspSource} https: data:;
  style-src 'unsafe-inline' https://fonts.googleapis.com ${cspSource};
  script-src 'nonce-${cspNonce}' ${cspSource};
  font-src https://fonts.gstatic.com data:;
  connect-src https:;
" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(fileName)}</title>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap">

<!-- Bundled locally at build time — no CDN fetch, works fully offline -->
<script nonce="${cspNonce}" src="${highlightAssets.scriptUri}"></script>
<link id="hljs-light-theme" rel="stylesheet" href="${highlightAssets.lightThemeUri}" disabled />
<link id="hljs-dark-theme" rel="stylesheet" href="${highlightAssets.darkThemeUri}" disabled />

<style nonce="${cspNonce}">
  :root {
    --accent-a: #8b5cf6;
    --accent-b: #22d3ee;
    --accent-c: #f472b6;
    --accent-gradient: linear-gradient(90deg, var(--accent-a), var(--accent-b) 55%, var(--accent-c));
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; height: 100%; }
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: 'Inter', var(--vscode-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: var(--vscode-font-size);
    line-height: 1.65;
  }
  a { color: var(--vscode-textLink-foreground); }
  a:hover { color: var(--vscode-textLink-activeForeground); }
  ::selection { background: var(--vscode-editor-selectionBackground); }
  .hidden { display: none !important; }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--vscode-scrollbarSlider-background); border-radius: 6px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--vscode-scrollbarSlider-hoverBackground); }

  .app-shell { display: flex; width: 100%; height: 100%; }

  #toc-panel {
    display: flex;
    flex-direction: column;
    width: 270px;
    flex: 0 0 270px;
    border-right: 1px solid var(--vscode-panel-border);
    overflow-y: auto;
    padding: 0.9rem;
    font-family: 'Inter', var(--vscode-font-family), sans-serif;
  }
  @media (max-width: 760px) {
    #toc-panel { display: none; }
    #toc-expand-btn { display: inline-flex !important; }
  }
  .toc-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.6rem; }
  .toc-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; opacity: 0.55; }
  .toc-list { display: flex; flex-direction: column; gap: 2px; font-size: 0.88rem; }
  .toc-empty { font-size: 0.75rem; opacity: 0.5; }
  .toc-link {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.78;
    text-decoration: none;
    border-left: 2px solid transparent;
    border-radius: 4px;
    padding: 0.3rem 0.5rem;
    transition: background 120ms ease, opacity 120ms ease, border-color 120ms ease;
  }
  .toc-link:hover { opacity: 1; background: rgba(255, 255, 255, 0.04); }
  .toc-link.active {
    opacity: 1;
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.16), rgba(34, 211, 238, 0.08));
    border-left-color: var(--accent-a);
    font-weight: 600;
  }
  .icon-btn {
    background: none;
    border: none;
    color: var(--vscode-editor-foreground);
    opacity: 0.55;
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
  }
  .icon-btn:hover { opacity: 1; }

  .main-panel { flex: 1 1 0%; min-width: 0; display: flex; flex-direction: column; height: 100%; }
  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 1.25rem;
    border-bottom: 1px solid var(--vscode-panel-border);
    flex: 0 0 auto;
  }
  .top-header-left { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
  #toc-expand-btn { display: none; }
  .doc-title {
    font-family: 'Sora', var(--vscode-font-family), sans-serif;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .build-tag { font-size: 0.65rem; opacity: 0.3; margin-left: 0.6rem; }
  #status-badge { font-size: 0.75rem; opacity: 0.6; flex: 0 0 auto; }

  .progress-track { height: 3px; width: 100%; background: rgba(255, 255, 255, 0.05); flex: 0 0 auto; }
  .progress-fill { height: 100%; width: 0%; background: var(--accent-gradient); transition: width 80ms linear; }

  #error-banner {
    background: var(--vscode-inputValidation-errorBackground);
    border-bottom: 1px solid var(--vscode-inputValidation-errorBorder);
    color: var(--vscode-inputValidation-errorForeground);
    padding: 0.5rem 1.25rem;
    font-size: 0.85rem;
    flex: 0 0 auto;
  }

  #content {
    flex: 1 1 auto;
    overflow-y: auto;
    width: 100%;
    padding: 1.75rem clamp(1.5rem, 5vw, 4.5rem);
    line-height: 1.75;
  }

  #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
    font-family: 'Sora', var(--vscode-font-family), sans-serif;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1.9em;
    margin-bottom: 0.6em;
    scroll-margin-top: 1.5rem;
    position: relative;
  }
  #content > h1:first-child, #content > h2:first-child { margin-top: 0; }
  #content h1 { font-size: 2.1rem; font-weight: 800; padding-bottom: 0.5em; }
  #content h1::after {
    content: ''; position: absolute; left: 0; bottom: 0;
    width: 72px; height: 4px; border-radius: 2px; background: var(--accent-gradient);
  }
  #content h2 { font-size: 1.5rem; padding-left: 0.75rem; border-left: 4px solid var(--accent-a); }
  #content h3 { font-size: 1.2rem; padding-left: 0.6rem; border-left: 3px solid var(--accent-b); }
  #content h4 { font-size: 1.05rem; padding-left: 0.5rem; border-left: 3px solid var(--accent-c); }
  #content h5, #content h6 { font-size: 0.9rem; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.04em; }
  .toc-anchor { position: absolute; left: -1.1rem; opacity: 0; text-decoration: none; transition: opacity 120ms ease; }
  #content h1:hover .toc-anchor, #content h2:hover .toc-anchor, #content h3:hover .toc-anchor,
  #content h4:hover .toc-anchor, #content h5:hover .toc-anchor, #content h6:hover .toc-anchor { opacity: 0.6; }

  #content p { margin: 0.9em 0; }
  #content strong, #content b { font-weight: 700; }
  #content em, #content i { font-style: italic; }
  #content ul, #content ol { padding-left: 1.4em; margin: 0.7em 0; }
  #content ul { list-style: disc; }
  #content ol { list-style: decimal; }
  #content li { margin: 0.35em 0; }
  #content li > ul, #content li > ol { margin: 0.3em 0 0.3em 0.2em; }
  .task-list-item { list-style: none; display: flex; align-items: flex-start; gap: 0.4rem; }

  #content code {
    font-family: 'JetBrains Mono', var(--vscode-editor-font-family), monospace;
    background: var(--vscode-textCodeBlock-background);
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    font-size: 0.88em;
  }

  .code-block-wrapper {
    margin: 1.2em 0;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--vscode-panel-border);
    background: var(--vscode-textCodeBlock-background);
  }
  .code-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.45rem 0.9rem;
    background: rgba(255, 255, 255, 0.035);
    border-bottom: 1px solid var(--vscode-panel-border);
  }
  .code-lang-badge {
    font-family: 'JetBrains Mono', var(--vscode-editor-font-family), monospace;
    font-size: 0.68rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.55;
  }
  .code-block-wrapper pre {
    margin: 0;
    padding: 1.1rem 1.15rem;
    overflow-x: auto;
  }
  .code-block-wrapper pre code {
    background: transparent;
    padding: 0;
    font-family: 'JetBrains Mono', var(--vscode-editor-font-family), monospace;
    font-size: 0.87em;
    line-height: 1.7;
  }

  .code-copy-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-family: 'Inter', var(--vscode-font-family), sans-serif;
    font-size: 0.72rem;
    font-weight: 500;
    line-height: 1;
    padding: 0.3rem 0.6rem;
    border-radius: 5px;
    border: 1px solid var(--vscode-panel-border);
    background: var(--vscode-button-secondaryBackground, rgba(255, 255, 255, 0.06));
    color: var(--vscode-button-secondaryForeground, var(--vscode-editor-foreground));
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 120ms ease, background 120ms ease, transform 120ms ease;
  }
  .code-copy-btn:hover { opacity: 1; background: var(--vscode-button-secondaryHoverBackground, rgba(255, 255, 255, 0.14)); transform: translateY(-1px); }
  .code-copy-btn:active { transform: translateY(0) scale(0.96); }
  .code-copy-btn.copied { background: #2ea043; border-color: transparent; color: #fff; opacity: 1; }
  .code-copy-btn svg { flex: 0 0 auto; }

  #content blockquote {
    border-left: 3px solid var(--accent-b);
    background: var(--vscode-textBlockQuote-background);
    margin: 1em 0; padding: 0.6rem 1.1rem;
    border-radius: 0 6px 6px 0; font-style: italic; opacity: 0.95;
  }
  #content table { border-collapse: collapse; width: 100%; margin: 1.1em 0; }
  #content th { background: rgba(255, 255, 255, 0.05); text-align: left; font-weight: 700; }
  #content th, #content td { border: 1px solid var(--vscode-panel-border); padding: 0.55rem 0.8rem; }
  #content tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }
  #content tr:hover td { background: rgba(139, 92, 246, 0.07); }
  #content hr { border: none; height: 3px; border-radius: 2px; background: var(--accent-gradient); opacity: 0.4; margin: 2.2em 0; }
  #content img { max-width: 100%; border-radius: 8px; }

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

  .task-checkbox {
    width: 16px; height: 16px;
    accent-color: var(--accent-a);
    margin-top: 0.2em;
    cursor: pointer;
    transition: transform 120ms ease;
  }
  .task-checkbox:active { transform: scale(0.85); }
  .task-checkbox:checked { filter: drop-shadow(0 0 4px var(--accent-a)); }

  .fade-in { animation: fadeIn 160ms ease-in; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(2px); } to { opacity: 1; transform: translateY(0); } }
</style>
</head>
<body>
  <div class="app-shell">
    <aside id="toc-panel">
      <div class="toc-header">
        <span class="toc-label">Contents</span>
        <button id="toc-collapse-btn" class="icon-btn" title="Hide outline">&laquo;</button>
      </div>
      <nav id="toc-list" class="toc-list">${tocHtml}</nav>
    </aside>

    <main class="main-panel">
      <header class="top-header">
        <div class="top-header-left">
          <button id="toc-expand-btn" class="icon-btn" title="Show outline">&raquo;</button>
          <span id="doc-title" class="doc-title">${escapeHtml(fileName)}</span>
          <span class="build-tag">build: v7-local-highlight-assets</span>
        </div>
        <div id="status-badge"></div>
      </header>

      <div class="progress-track"><div id="progress-fill" class="progress-fill"></div></div>

      <div id="error-banner" class="hidden"></div>

      <article id="content" class="fade-in">${markdownText}</article>
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
  const progressFillEl = document.getElementById('progress-fill');

  let currentHeadings = [];

  function escapeHtml(value) {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function renderToc(toc) {
    if (!toc || toc.length === 0) {
      tocListEl.innerHTML = '<span class="toc-empty">No headings found</span>';
      return;
    }
    const minLevel = Math.min.apply(null, toc.map(function (t) { return t.level; }));
    tocListEl.innerHTML = toc.map(function (entry) {
      const indent = (entry.level - minLevel) * 12;
      return '<a href="#' + entry.slug + '" data-slug="' + entry.slug + '" style="margin-left:' + indent + 'px" class="toc-link">' +
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

  function updateProgress() {
    const max = contentEl.scrollHeight - contentEl.clientHeight;
    const pct = max > 0 ? (contentEl.scrollTop / max) * 100 : 0;
    progressFillEl.style.width = pct + '%';
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

  const COPY_ICON_SVG =
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.4">' +
    '<rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.3"/>' +
    '<path d="M3.3 10.2H2.7A1.2 1.2 0 0 1 1.5 9V2.7A1.2 1.2 0 0 1 2.7 1.5H9a1.2 1.2 0 0 1 1.2 1.2v.6"/>' +
    '</svg>';

  function detectLanguageLabel(codeEl) {
    const match = /language-([a-z0-9]+)/i.exec(codeEl.className || '');
    return match ? match[1] : 'text';
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

      const headerBar = document.createElement('div');
      headerBar.className = 'code-block-header';

      const langBadge = document.createElement('span');
      langBadge.className = 'code-lang-badge';
      langBadge.textContent = codeEl ? detectLanguageLabel(codeEl) : 'text';

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy-btn';
      button.innerHTML = COPY_ICON_SVG + '<span>Copy</span>';
      button.addEventListener('click', function () {
        const label = button.querySelector('span');
        const text = codeEl ? codeEl.innerText : pre.innerText;
        navigator.clipboard.writeText(text).then(function () {
          label.textContent = 'Copied!';
          button.classList.add('copied');
          setTimeout(function () {
            label.textContent = 'Copy';
            button.classList.remove('copied');
          }, 1200);
        }).catch(function () {
          label.textContent = 'Failed';
          setTimeout(function () { label.textContent = 'Copy'; }, 1200);
        });
      });

      headerBar.appendChild(langBadge);
      headerBar.appendChild(button);
      wrapper.appendChild(headerBar);
      wrapper.appendChild(pre);
    });
  }

  function setActiveSlug(slug) {
    tocListEl.querySelectorAll('.toc-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-slug') === slug);
    });
  }

  function recomputeActiveHeading() {
    if (currentHeadings.length === 0) { return; }
    const activationLine = contentEl.getBoundingClientRect().top + 96;
    let current = currentHeadings[0];
    for (let i = 0; i < currentHeadings.length; i++) {
      if (currentHeadings[i].getBoundingClientRect().top <= activationLine) {
        current = currentHeadings[i];
      } else {
        break;
      }
    }
    setActiveSlug(current.id);
  }

  function refreshHeadingsList() {
    currentHeadings = Array.prototype.slice.call(
      contentEl.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]')
    );
    recomputeActiveHeading();
  }

  let scrollTicking = false;
  contentEl.addEventListener('scroll', function () {
    if (scrollTicking) { return; }
    scrollTicking = true;
    requestAnimationFrame(function () {
      recomputeActiveHeading();
      updateProgress();
      scrollTicking = false;
    });
  });

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
    const slug = link.getAttribute('data-slug');
    const target = document.getElementById(slug);
    if (target) {
      setActiveSlug(slug);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  tocCollapseBtn.addEventListener('click', function () {
    tocPanelEl.style.display = 'none';
    tocExpandBtn.style.display = 'inline-flex';
  });

  tocExpandBtn.addEventListener('click', function () {
    tocPanelEl.style.display = 'flex';
    tocExpandBtn.style.display = 'none';
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
        refreshHeadingsList();
        updateProgress();
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
  refreshHeadingsList();
  updateProgress();

  vscode.postMessage({ type: 'ready' });
})();
</script>
</body>
</html>`;
}