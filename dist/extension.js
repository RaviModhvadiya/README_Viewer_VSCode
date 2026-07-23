"use strict";var He=Object.create;var M=Object.defineProperty;var Ue=Object.getOwnPropertyDescriptor;var Fe=Object.getOwnPropertyNames;var We=Object.getPrototypeOf,Ve=Object.prototype.hasOwnProperty;var Ze=(n,e)=>{for(var t in e)M(n,t,{get:e[t],enumerable:!0})},ke=(n,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of Fe(e))!Ve.call(n,r)&&r!==t&&M(n,r,{get:()=>e[r],enumerable:!(s=Ue(e,r))||s.enumerable});return n};var fe=(n,e,t)=>(t=n!=null?He(We(n)):{},ke(e||!n||!n.__esModule?M(t,"default",{value:n,enumerable:!0}):t,n)),Qe=n=>ke(M({},"__esModule",{value:!0}),n);var Zt={};Ze(Zt,{activate:()=>Wt,deactivate:()=>Vt});module.exports=Qe(Zt);var u=fe(require("vscode")),C=fe(require("path"));function V(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ke(n){if(!n.length)return'<span class="opacity-50 text-xs">No headings found</span>';let e=Math.min(...n.map(t=>t.level));return n.map(t=>{let s=(t.level-e)*12;return`<a href="#${t.slug}" data-slug="${t.slug}" style="margin-left:${s}px" class="toc-link block truncate opacity-80 hover:opacity-100 border-l-2 border-transparent pl-2 py-1 no-underline">${V(t.text)}</a>`}).join("")}function Z(n,e,t,s=[],r="README.md"){let i=Ke(s);return`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta http-equiv="Content-Security-Policy" content="
  default-src 'none';
  img-src ${t} https: data:;
  style-src 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com ${t};
  script-src 'nonce-${e}' https://cdn.tailwindcss.com https://unpkg.com;
  font-src https://unpkg.com data:;
  connect-src https:;
" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${V(r)}</title>

<script nonce="${e}" src="https://cdn.tailwindcss.com"></script>
<script nonce="${e}" type="module" src="https://unpkg.com/@vscode/webview-ui-toolkit/dist/toolkit.min.js"></script>
<script nonce="${e}" src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"></script>
<link id="hljs-light-theme" rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github.min.css" disabled />
<link id="hljs-dark-theme" rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css" disabled />

<script nonce="${e}">
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

<style nonce="${e}">
  html { scroll-behavior: smooth; }
  html, body { height: 100%; margin: 0; padding: 0; }
  body {
    background: var(--vscode-editor-background);
    color: var(--vscode-editor-foreground);
    font-family: var(--vscode-font-family), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: var(--vscode-font-size);
    line-height: 1.65;
  }
  a { color: var(--vscode-textLink-foreground); }
  a:hover { color: var(--vscode-textLink-activeForeground); }
  ::selection { background: var(--vscode-editor-selectionBackground); }

  /* ---- Typography hierarchy (fixes Tailwind Preflight stripping default heading styles) ---- */
  #content { line-height: 1.75; }
  #content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-top: 1.8em;
    margin-bottom: 0.6em;
    scroll-margin-top: 1.5rem;
  }
  #content > h1:first-child, #content > h2:first-child { margin-top: 0; }
  #content h1 { font-size: 1.9rem; font-weight: 700; padding-bottom: 0.35em; border-bottom: 1px solid var(--vscode-panel-border); }
  #content h2 { font-size: 1.45rem; font-weight: 700; padding-bottom: 0.3em; border-bottom: 1px solid var(--vscode-panel-border); }
  #content h3 { font-size: 1.2rem; }
  #content h4 { font-size: 1.05rem; }
  #content h5, #content h6 { font-size: 0.95rem; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.03em; }
  #content p { margin: 0.9em 0; }
  #content strong, #content b { font-weight: 700; }
  #content em, #content i { font-style: italic; }
  #content ul, #content ol { padding-left: 1.4em; margin: 0.7em 0; }
  #content ul { list-style: disc; }
  #content ol { list-style: decimal; }
  #content li { margin: 0.3em 0; }
  #content li > ul, #content li > ol { margin: 0.3em 0 0.3em 0.2em; }

  /* ---- Inline code + fenced code blocks ---- */
  #content code {
    font-family: var(--vscode-editor-font-family);
    background: var(--vscode-textCodeBlock-background);
    padding: 0.15rem 0.35rem;
    border-radius: 4px;
    font-size: 0.9em;
  }
  .code-block-wrapper { position: relative; margin: 1em 0; }
  .code-block-wrapper pre {
    margin: 0;
    padding: 0.9rem 1rem;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid var(--vscode-panel-border);
  }
  .code-block-wrapper pre code {
    background: transparent;
    padding: 0;
    font-size: 0.85em;
  }
  .code-copy-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 5px;
    background: var(--vscode-button-secondaryBackground, rgba(255, 255, 255, 0.08));
    color: var(--vscode-button-secondaryForeground, var(--vscode-editor-foreground));
    border: 1px solid var(--vscode-panel-border);
    opacity: 0;
    transition: opacity 120ms ease, background 120ms ease;
    cursor: pointer;
  }
  .code-block-wrapper:hover .code-copy-btn { opacity: 0.85; }
  .code-copy-btn:hover { opacity: 1 !important; background: var(--vscode-button-secondaryHoverBackground, rgba(255, 255, 255, 0.15)); }

  /* ---- Blockquotes, tables, rules ---- */
  #content blockquote {
    border-left: 3px solid var(--vscode-textBlockQuote-border);
    background: var(--vscode-textBlockQuote-background);
    margin: 1em 0;
    padding: 0.5rem 1rem;
    border-radius: 0 6px 6px 0;
    font-style: italic;
    opacity: 0.95;
  }
  #content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
  #content th { background: var(--vscode-list-hoverBackground, rgba(255, 255, 255, 0.05)); text-align: left; font-weight: 600; }
  #content th, #content td { border: 1px solid var(--vscode-panel-border); padding: 0.5rem 0.75rem; }
  #content tr:nth-child(even) td { background: rgba(255, 255, 255, 0.02); }
  #content hr { border: none; border-top: 1px solid var(--vscode-panel-border); margin: 2em 0; }
  #content img { max-width: 100%; border-radius: 6px; }

  /* ---- Task checkboxes ---- */
  .task-checkbox {
    width: 16px;
    height: 16px;
    accent-color: var(--vscode-focusBorder);
    margin-top: 0.2em;
    cursor: pointer;
    transition: transform 120ms ease;
  }
  .task-checkbox:active { transform: scale(0.88); }

  /* ---- Table of contents ---- */
  .toc-link { transition: background 120ms ease, opacity 120ms ease, border-color 120ms ease; border-radius: 4px; }
  .toc-link.active {
    background: var(--vscode-list-activeSelectionBackground, rgba(255, 255, 255, 0.08));
    color: var(--vscode-textLink-activeForeground);
    font-weight: 600;
    border-left-color: var(--vscode-focusBorder) !important;
  }

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
      <nav id="toc-list" class="flex flex-col gap-0.5 text-sm">${i}</nav>
    </aside>

    <main class="flex-1 flex flex-col min-w-0">
      <header class="flex items-center justify-between px-4 py-2 border-b border-[var(--vscode-panel-border)]">
        <div class="flex items-center gap-2 min-w-0">
          <button id="toc-expand-btn" class="hidden text-xs opacity-60 hover:opacity-100" title="Show outline">&raquo;</button>
          <span id="doc-title" class="font-semibold truncate">${V(r)}</span>
        </div>
        <div id="status-badge" class="text-xs opacity-60"></div>
      </header>

      <div id="error-banner" class="hidden bg-[var(--vscode-inputValidation-errorBackground)] border-b border-[var(--vscode-inputValidation-errorBorder)] text-[var(--vscode-inputValidation-errorForeground)] px-4 py-2 text-sm"></div>

      <article id="content" class="flex-1 overflow-y-auto px-6 py-5 max-w-3xl fade-in">${n}</article>
    </main>
  </div>

<script nonce="${e}">
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
</html>`}function X(){return{async:!1,breaks:!1,extensions:null,gfm:!0,hooks:null,pedantic:!1,renderer:null,silent:!1,tokenizer:null,walkTokens:null}}var R=X();function Te(n){R=n}var S={exec:()=>null};function L(n){let e=[];return t=>{let s=Math.max(0,Math.min(3,t-1)),r=e[s];return r||(r=n(s),e[s]=r),r}}function d(n,e=""){let t=typeof n=="string"?n:n.source,s={replace:(r,i)=>{let a=typeof i=="string"?i:i.source;return a=a.replace(m.caret,"$1"),t=t.replace(r,a),s},getRegex:()=>new RegExp(t,e)};return s}var Ge=((n="")=>{try{return!!new RegExp("(?<=1)(?<!1)"+n)}catch{return!1}})(),m={codeRemoveIndent:/^(?: {1,4}| {0,3}\t)/gm,outputLinkReplace:/\\([\[\]])/g,indentCodeCompensation:/^(\s+)(?:```)/,beginningSpace:/^\s+/,endingHash:/#$/,startingSpaceChar:/^ /,endingSpaceChar:/ $/,nonSpaceChar:/[^ ]/,newLineCharGlobal:/\n/g,tabCharGlobal:/\t/g,multipleSpaceGlobal:/\s+/g,blankLine:/^[ \t]*$/,doubleBlankLine:/\n[ \t]*\n[ \t]*$/,blockquoteStart:/^ {0,3}>/,blockquoteSetextReplace:/\n {0,3}((?:=+|-+) *)(?=\n|$)/g,blockquoteSetextReplace2:/^ {0,3}>[ \t]?/gm,listReplaceNesting:/^ {1,4}(?=( {4})*[^ ])/g,listIsTask:/^\[[ xX]\] +\S/,listReplaceTask:/^\[[ xX]\] +/,listTaskCheckbox:/\[[ xX]\]/,anyLine:/\n.*\n/,hrefBrackets:/^<(.*)>$/,tableDelimiter:/[:|]/,tableAlignChars:/^\||\| *$/g,tableRowBlankLine:/\n[ \t]*$/,tableAlignRight:/^ *-+: *$/,tableAlignCenter:/^ *:-+: *$/,tableAlignLeft:/^ *:-+ *$/,startATag:/^<a /i,endATag:/^<\/a>/i,startPreScriptTag:/^<(pre|code|kbd|script)(\s|>)/i,endPreScriptTag:/^<\/(pre|code|kbd|script)(\s|>)/i,startAngleBracket:/^</,endAngleBracket:/>$/,pedanticHrefTitle:/^([^'"]*[^\s])\s+(['"])(.*)\2/,unicodeAlphaNumeric:/[\p{L}\p{N}]/u,escapeTest:/[&<>"']/,escapeReplace:/[&<>"']/g,escapeTestNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,escapeReplaceNoEncode:/[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,caret:/(^|[^\[])\^/g,percentDecode:/%25/g,findPipe:/\|/g,splitPipe:/ \|/,slashPipe:/\\\|/g,carriageReturn:/\r\n|\r/g,spaceLine:/^ +$/gm,notSpaceStart:/^\S*/,endingNewline:/\n$/,listItemRegex:n=>new RegExp(`^( {0,3}${n})((?:[	 ][^\\n]*)?(?:\\n|$))`),nextBulletRegex:L(n=>new RegExp(`^ {0,${n}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`)),hrRegex:L(n=>new RegExp(`^ {0,${n}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`)),fencesBeginRegex:L(n=>new RegExp(`^ {0,${n}}(?:\`\`\`|~~~)`)),headingBeginRegex:L(n=>new RegExp(`^ {0,${n}}#`)),htmlBeginRegex:L(n=>new RegExp(`^ {0,${n}}<(?:[a-z].*>|!--)`,"i")),blockquoteBeginRegex:L(n=>new RegExp(`^ {0,${n}}>`))},Xe=/^(?:[ \t]*(?:\n|$))+/,Ye=/^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,Je=/^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,D=/^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,et=/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,Y=/ {0,3}(?:[*+-]|\d{1,9}[.)])/,Se=/^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,$e=d(Se).replace(/bull/g,Y).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/\|table/g,"").getRegex(),tt=d(Se).replace(/bull/g,Y).replace(/blockCode/g,/(?: {4}| {0,3}\t)/).replace(/fences/g,/ {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g,/ {0,3}>/).replace(/heading/g,/ {0,3}#{1,6}(?:\s|$)/).replace(/html/g,/ {0,3}<[^\n>]+>\n/).replace(/table/g,/ {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),J=/^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table|[ \t]+\n)[^\n]+)*)/,nt=/^[^\n]+/,ee=/(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,rt=d(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label",ee).replace("title",/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),st=d(/^(bull)([ \t][^\n]*?)?(?:\n|$)/).replace(/bull/g,Y).getRegex(),j="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",te=/<!--(?:-?>|[\s\S]*?(?:-->|$))/,it=d("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n*|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>[^\\n]*\\n*|$)|<![A-Z][\\s\\S]*?(?:>[^\\n]*\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>[^\\n]*\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))","i").replace("comment",te).replace("tag",j).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),Re=n=>d(J).replace("hr",D).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("|table","").replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list",n).replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",j).getRegex(),ot=Re(/ {0,3}(?:[*+-]|1[.)])[ \t]+[^ \t\n]/),at=Re(/ {0,3}(?:[*+-]|\d{1,9}[.)])(?:[ \t]|\n|$)/),lt=d(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph",at).getRegex(),ne={blockquote:lt,code:Ye,def:rt,fences:Je,heading:et,hr:D,html:it,lheading:$e,list:st,newline:Xe,paragraph:ot,table:S,text:nt},me=d("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr",D).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("blockquote"," {0,3}>").replace("code","(?: {4}| {0,3}	)[^\\n]").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",j).getRegex(),ct={...ne,lheading:tt,table:me,paragraph:d(J).replace("hr",D).replace("heading"," {0,3}#{1,6}(?:\\s|$)").replace("|lheading","").replace("table",me).replace("blockquote"," {0,3}>").replace("fences"," {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~~~)[^\\n]*\\n").replace("list"," {0,3}(?:[*+-]|1[.)])[ \\t]+[^ \\t\\n]").replace("html","</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag",j).getRegex()},pt={...ne,html:d(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment",te).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,heading:/^(#{1,6})(.*)(?:\n+|$)/,fences:S,lheading:/^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,paragraph:d(J).replace("hr",D).replace("heading",` *#{1,6} *[^
]`).replace("lheading",$e).replace("|table","").replace("blockquote"," {0,3}>").replace("|fences","").replace("|list","").replace("|html","").replace("|tag","").getRegex()},ht=/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,ut=/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,Ce=/^( {2,}|\\)\n(?!\s*$)/,dt=/^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,P=/[\p{P}\p{S}]/u,H=/[\s\p{P}\p{S}]/u,re=/[^\s\p{P}\p{S}]/u,gt=d(/^((?![*_])punctSpace)/,"u").replace(/punctSpace/g,H).getRegex(),Ae=/(?!~)[\p{P}\p{S}]/u,kt=/(?!~)[\s\p{P}\p{S}]/u,ft=/(?:[^\s\p{P}\p{S}]|~)/u,mt=d(/link|precode-code|html/,"g").replace("link",/\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-",Ge?"(?<!`)()":"(^^|[^`])").replace("code",/(?<b>`+)[^`]+\k<b>(?!`)/).replace("html",/<(?! )[^<>]*?>/).getRegex(),Le=/^(?:\*+(?:((?!\*)punct)|([^\s*]))?)|^_+(?:((?!_)punct)|([^\s_]))?/,bt=d(Le,"u").replace(/punct/g,P).getRegex(),xt=d(Le,"u").replace(/punct/g,Ae).getRegex(),Pe="^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",wt=d(Pe,"gu").replace(/notPunctSpace/g,re).replace(/punctSpace/g,H).replace(/punct/g,P).getRegex(),vt=d(Pe,"gu").replace(/notPunctSpace/g,ft).replace(/punctSpace/g,kt).replace(/punct/g,Ae).getRegex(),yt=d("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)","gu").replace(/notPunctSpace/g,re).replace(/punctSpace/g,H).replace(/punct/g,P).getRegex(),Et=d(/^~~?(?:((?!~)punct)|[^\s~])/,"u").replace(/punct/g,P).getRegex(),Tt="^[^~]+(?=[^~])|(?!~)punct(~~?)(?=[\\s]|$)|notPunctSpace(~~?)(?!~)(?=punctSpace|$)|(?!~)punctSpace(~~?)(?=notPunctSpace)|[\\s](~~?)(?!~)(?=punct)|(?!~)punct(~~?)(?!~)(?=punct)|notPunctSpace(~~?)(?=notPunctSpace)",St=d(Tt,"gu").replace(/notPunctSpace/g,re).replace(/punctSpace/g,H).replace(/punct/g,P).getRegex(),$t=d(/\\(punct)/,"gu").replace(/punct/g,P).getRegex(),Rt=d(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme",/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email",/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),Ct=d(te).replace("(?:-->|$)","-->").getRegex(),At=d("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment",Ct).replace("attribute",/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),q=/(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+(?!`)[^`]*?`+(?!`)|``+(?=\])|[^\[\]\\`])*?/,Lt=d(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]+(?:\n[ \t]*)?|\n[ \t]*)(title))?\s*\)/).replace("label",q).replace("href",/<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]+|(?=\))/).replace("title",/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),Be=d(/^!?\[(label)\]\[(ref)\]/).replace("label",q).replace("ref",ee).getRegex(),ze=d(/^!?\[(ref)\](?:\[\])?/).replace("ref",ee).getRegex(),Pt=d("reflink|nolink(?!\\()","g").replace("reflink",Be).replace("nolink",ze).getRegex(),be=/[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,se={_backpedal:S,anyPunctuation:$t,autolink:Rt,blockSkip:mt,br:Ce,code:ut,del:S,delLDelim:S,delRDelim:S,emStrongLDelim:bt,emStrongRDelimAst:wt,emStrongRDelimUnd:yt,escape:ht,link:Lt,nolink:ze,punctuation:gt,reflink:Be,reflinkSearch:Pt,tag:At,text:dt,url:S},Bt={...se,link:d(/^!?\[(label)\]\((.*?)\)/).replace("label",q).getRegex(),reflink:d(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",q).getRegex()},Q={...se,emStrongRDelimAst:vt,emStrongLDelim:xt,delLDelim:Et,delRDelim:St,url:d(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol",be).replace("email",/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),_backpedal:/(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,del:/^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,text:d(/^(`+|~+|[^`~])(?:(?=[`~])|(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol",be).getRegex()},zt={...Q,br:d(Ce).replace("{2,}","*").getRegex(),text:d(Q.text).replace("\\b_","\\b_| {2,}\\n").replace(/\{2,\}/g,"*").getRegex()},_={normal:ne,gfm:ct,pedantic:pt},z={normal:se,gfm:Q,breaks:zt,pedantic:Bt},It={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},xe=n=>It[n];function y(n,e){if(e){if(m.escapeTest.test(n))return n.replace(m.escapeReplace,xe)}else if(m.escapeTestNoEncode.test(n))return n.replace(m.escapeReplaceNoEncode,xe);return n}function we(n){try{n=encodeURI(n).replace(m.percentDecode,"%")}catch{return null}return n}function ve(n,e){let t=n.replace(m.findPipe,(i,a,o)=>{let l=!1,c=a;for(;--c>=0&&o[c]==="\\";)l=!l;return l?"|":" |"}),s=t.split(m.splitPipe),r=0;if(s[0].trim()||s.shift(),s.length>0&&!s.at(-1)?.trim()&&s.pop(),e)if(s.length>e)s.splice(e);else for(;s.length<e;)s.push("");for(;r<s.length;r++)s[r]=s[r].trim().replace(m.slashPipe,"|");return s}function T(n,e,t){let s=n.length;if(s===0)return"";let r=0;for(;r<s;){let i=n.charAt(s-r-1);if(i===e&&!t)r++;else if(i!==e&&t)r++;else break}return n.slice(0,s-r)}function ye(n){let e=n.split(`
`),t=e.length-1;for(;t>=0&&m.blankLine.test(e[t]);)t--;return e.length-t<=2?n:e.slice(0,t+1).join(`
`)}function Dt(n,e){if(n.indexOf(e[1])===-1)return-1;let t=0;for(let s=0;s<n.length;s++)if(n[s]==="\\")s++;else if(n[s]===e[0])t++;else if(n[s]===e[1]&&(t--,t<0))return s;return t>0?-2:-1}function Mt(n,e=0){let t=e,s="";for(let r of n)if(r==="	"){let i=4-t%4;s+=" ".repeat(i),t+=i}else s+=r,t++;return s}function Ee(n,e,t,s,r){let i=e.href,a=e.title||null,o=n[1].replace(r.other.outputLinkReplace,"$1");s.state.inLink=!0;let l={type:n[0].charAt(0)==="!"?"image":"link",raw:t,href:i,title:a,text:o,tokens:s.inlineTokens(o)};return s.state.inLink=!1,l}function _t(n,e,t){let s=n.match(t.other.indentCodeCompensation);if(s===null)return e;let r=s[1];return e.split(`
`).map(i=>{let a=i.match(t.other.beginningSpace);if(a===null)return i;let[o]=a;return o.length>=r.length?i.slice(r.length):i}).join(`
`)}var O=class{options;rules;lexer;constructor(n){this.options=n||R}space(n){let e=this.rules.block.newline.exec(n);if(e&&e[0].length>0)return{type:"space",raw:e[0]}}code(n){let e=this.rules.block.code.exec(n);if(e){let t=this.options.pedantic?e[0]:ye(e[0]),s=t.replace(this.rules.other.codeRemoveIndent,"");return{type:"code",raw:t,codeBlockStyle:"indented",text:s}}}fences(n){let e=this.rules.block.fences.exec(n);if(e){let t=e[0],s=_t(t,e[3]||"",this.rules);return{type:"code",raw:t,lang:e[2]?e[2].trim().replace(this.rules.inline.anyPunctuation,"$1"):e[2],text:s}}}heading(n){let e=this.rules.block.heading.exec(n);if(e){let t=e[2].trim();if(this.rules.other.endingHash.test(t)){let s=T(t,"#");(this.options.pedantic||!s||this.rules.other.endingSpaceChar.test(s))&&(t=s.trim())}return{type:"heading",raw:T(e[0],`
`),depth:e[1].length,text:t,tokens:this.lexer.inline(t)}}}hr(n){let e=this.rules.block.hr.exec(n);if(e)return{type:"hr",raw:T(e[0],`
`)}}blockquote(n){let e=this.rules.block.blockquote.exec(n);if(e){let t=T(e[0],`
`).split(`
`),s="",r="",i=[];for(;t.length>0;){let a=!1,o=[],l;for(l=0;l<t.length;l++)if(this.rules.other.blockquoteStart.test(t[l]))o.push(t[l]),a=!0;else if(!a)o.push(t[l]);else break;t=t.slice(l);let c=o.join(`
`),h=c.replace(this.rules.other.blockquoteSetextReplace,`
    $1`).replace(this.rules.other.blockquoteSetextReplace2,"");s=s?`${s}
${c}`:c,r=r?`${r}
${h}`:h;let p=this.lexer.state.top;if(this.lexer.state.top=!0,this.lexer.blockTokens(h,i,!0),this.lexer.state.top=p,t.length===0)break;let g=i.at(-1);if(g?.type==="code")break;if(g?.type==="blockquote"){let b=g,f=b.raw+`
`+t.join(`
`),E=this.blockquote(f);i[i.length-1]=E,s=s.substring(0,s.length-b.raw.length)+E.raw,r=r.substring(0,r.length-b.text.length)+E.text;break}else if(g?.type==="list"){let b=g,f=b.raw+`
`+t.join(`
`),E=this.list(f);i[i.length-1]=E,s=s.substring(0,s.length-g.raw.length)+E.raw,r=r.substring(0,r.length-b.raw.length)+E.raw,t=f.substring(i.at(-1).raw.length).split(`
`);continue}}return{type:"blockquote",raw:s,tokens:i,text:r}}}list(n){let e=this.rules.block.list.exec(n);if(e){let t=e[1].trim(),s=t.length>1,r={type:"list",raw:"",ordered:s,start:s?+t.slice(0,-1):"",loose:!1,items:[]};t=s?`\\d{1,9}\\${t.slice(-1)}`:`\\${t}`,this.options.pedantic&&(t=s?t:"[*+-]");let i=this.rules.other.listItemRegex(t),a=!1;for(;n;){let l=!1,c="",h="";if(!(e=i.exec(n))||this.rules.block.hr.test(n))break;c=e[0],n=n.substring(c.length);let p=Mt(e[2].split(`
`,1)[0],e[1].length),g=n.split(`
`,1)[0],b=!p.trim(),f=0;if(this.options.pedantic?(f=2,h=p.trimStart()):b?f=e[1].length+1:(f=p.search(this.rules.other.nonSpaceChar),f=f>4?1:f,h=p.slice(f),f+=e[1].length),b&&this.rules.other.blankLine.test(g)&&(c+=g+`
`,n=n.substring(g.length+1),l=!0),!l){let E=this.rules.other.nextBulletRegex(f),ue=this.rules.other.hrRegex(f),de=this.rules.other.fencesBeginRegex(f),ge=this.rules.other.headingBeginRegex(f),Ne=this.rules.other.htmlBeginRegex(f),je=this.rules.other.blockquoteBeginRegex(f);for(;n;){let W=n.split(`
`,1)[0],B;if(g=W,this.options.pedantic?(g=g.replace(this.rules.other.listReplaceNesting,"  "),B=g):B=g.replace(this.rules.other.tabCharGlobal,"    "),de.test(g)||ge.test(g)||Ne.test(g)||je.test(g)||E.test(g)||ue.test(g))break;if(B.search(this.rules.other.nonSpaceChar)>=f||!g.trim())h+=`
`+B.slice(f);else{if(b||p.replace(this.rules.other.tabCharGlobal,"    ").search(this.rules.other.nonSpaceChar)>=4||de.test(p)||ge.test(p)||ue.test(p))break;h+=`
`+g}b=!g.trim(),c+=W+`
`,n=n.substring(W.length+1),p=B.slice(f)}}r.loose||(a?r.loose=!0:this.rules.other.doubleBlankLine.test(c)&&(a=!0)),r.items.push({type:"list_item",raw:c,task:!!this.options.gfm&&this.rules.other.listIsTask.test(h),loose:!1,text:h,tokens:[]}),r.raw+=c}let o=r.items.at(-1);if(o)o.raw=o.raw.trimEnd(),o.text=o.text.trimEnd();else return;r.raw=r.raw.trimEnd();for(let l of r.items){this.lexer.state.top=!1,l.tokens=this.lexer.blockTokens(l.text,[]);let c=l.tokens[0];if(l.task&&(c?.type==="text"||c?.type==="paragraph")){l.text=l.text.replace(this.rules.other.listReplaceTask,""),c.raw=c.raw.replace(this.rules.other.listReplaceTask,""),c.text=c.text.replace(this.rules.other.listReplaceTask,"");for(let p=this.lexer.inlineQueue.length-1;p>=0;p--)if(this.rules.other.listIsTask.test(this.lexer.inlineQueue[p].src)){this.lexer.inlineQueue[p].src=this.lexer.inlineQueue[p].src.replace(this.rules.other.listReplaceTask,"");break}let h=this.rules.other.listTaskCheckbox.exec(l.raw);if(h){let p={type:"checkbox",raw:h[0]+" ",checked:h[0]!=="[ ]"};l.checked=p.checked,r.loose?l.tokens[0]&&["paragraph","text"].includes(l.tokens[0].type)&&"tokens"in l.tokens[0]&&l.tokens[0].tokens?(l.tokens[0].raw=p.raw+l.tokens[0].raw,l.tokens[0].text=p.raw+l.tokens[0].text,l.tokens[0].tokens.unshift(p)):l.tokens.unshift({type:"paragraph",raw:p.raw,text:p.raw,tokens:[p]}):l.tokens.unshift(p)}}else l.task&&(l.task=!1);if(!r.loose){let h=l.tokens.filter(g=>g.type==="space"),p=h.length>0&&h.some(g=>this.rules.other.anyLine.test(g.raw));r.loose=p}}if(r.loose)for(let l of r.items){l.loose=!0;for(let c of l.tokens)c.type==="text"&&(c.type="paragraph")}return r}}html(n){let e=this.rules.block.html.exec(n);if(e){let t=ye(e[0]);return{type:"html",block:!0,raw:t,pre:e[1]==="pre"||e[1]==="script"||e[1]==="style",text:t}}}def(n){let e=this.rules.block.def.exec(n);if(e){let t=e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal," "),s=e[2]?e[2].replace(this.rules.other.hrefBrackets,"$1").replace(this.rules.inline.anyPunctuation,"$1"):"",r=e[3]?e[3].substring(1,e[3].length-1).replace(this.rules.inline.anyPunctuation,"$1"):e[3];return{type:"def",tag:t,raw:T(e[0],`
`),href:s,title:r}}}table(n){let e=this.rules.block.table.exec(n);if(!e||!this.rules.other.tableDelimiter.test(e[2]))return;let t=ve(e[1]),s=e[2].replace(this.rules.other.tableAlignChars,"").split("|"),r=e[3]?.trim()?e[3].replace(this.rules.other.tableRowBlankLine,"").split(`
`):[],i={type:"table",raw:T(e[0],`
`),header:[],align:[],rows:[]};if(t.length===s.length){for(let a of s)this.rules.other.tableAlignRight.test(a)?i.align.push("right"):this.rules.other.tableAlignCenter.test(a)?i.align.push("center"):this.rules.other.tableAlignLeft.test(a)?i.align.push("left"):i.align.push(null);for(let a=0;a<t.length;a++)i.header.push({text:t[a],tokens:this.lexer.inline(t[a]),header:!0,align:i.align[a]});for(let a of r)i.rows.push(ve(a,i.header.length).map((o,l)=>({text:o,tokens:this.lexer.inline(o),header:!1,align:i.align[l]})));return i}}lheading(n){let e=this.rules.block.lheading.exec(n);if(e){let t=e[1].trim();return{type:"heading",raw:T(e[0],`
`),depth:e[2].charAt(0)==="="?1:2,text:t,tokens:this.lexer.inline(t)}}}paragraph(n){let e=this.rules.block.paragraph.exec(n);if(e){let t=e[1].charAt(e[1].length-1)===`
`?e[1].slice(0,-1):e[1];return{type:"paragraph",raw:e[0],text:t,tokens:this.lexer.inline(t)}}}text(n){let e=this.rules.block.text.exec(n);if(e)return{type:"text",raw:e[0],text:e[0],tokens:this.lexer.inline(e[0])}}escape(n){let e=this.rules.inline.escape.exec(n);if(e)return{type:"escape",raw:e[0],text:e[1]}}tag(n){let e=this.rules.inline.tag.exec(n);if(e)return!this.lexer.state.inLink&&this.rules.other.startATag.test(e[0])?this.lexer.state.inLink=!0:this.lexer.state.inLink&&this.rules.other.endATag.test(e[0])&&(this.lexer.state.inLink=!1),!this.lexer.state.inRawBlock&&this.rules.other.startPreScriptTag.test(e[0])?this.lexer.state.inRawBlock=!0:this.lexer.state.inRawBlock&&this.rules.other.endPreScriptTag.test(e[0])&&(this.lexer.state.inRawBlock=!1),{type:"html",raw:e[0],inLink:this.lexer.state.inLink,inRawBlock:this.lexer.state.inRawBlock,block:!1,text:e[0]}}link(n){let e=this.rules.inline.link.exec(n);if(e){let t=e[2].trim();if(!this.options.pedantic&&this.rules.other.startAngleBracket.test(t)){if(!this.rules.other.endAngleBracket.test(t))return;let i=T(t.slice(0,-1),"\\");if((t.length-i.length)%2===0)return}else{let i=Dt(e[2],"()");if(i===-2)return;if(i>-1){let a=(e[0].indexOf("!")===0?5:4)+e[1].length+i;e[2]=e[2].substring(0,i),e[0]=e[0].substring(0,a).trim(),e[3]=""}}let s=e[2],r="";if(this.options.pedantic){let i=this.rules.other.pedanticHrefTitle.exec(s);i&&(s=i[1],r=i[3])}else r=e[3]?e[3].slice(1,-1):"";return s=s.trim(),this.rules.other.startAngleBracket.test(s)&&(this.options.pedantic&&!this.rules.other.endAngleBracket.test(t)?s=s.slice(1):s=s.slice(1,-1)),Ee(e,{href:s&&s.replace(this.rules.inline.anyPunctuation,"$1"),title:r&&r.replace(this.rules.inline.anyPunctuation,"$1")},e[0],this.lexer,this.rules)}}reflink(n,e){let t;if((t=this.rules.inline.reflink.exec(n))||(t=this.rules.inline.nolink.exec(n))){let s=(t[2]||t[1]).replace(this.rules.other.multipleSpaceGlobal," "),r=e[s.toLowerCase()];if(!r){let i=t[0].charAt(0);return{type:"text",raw:i,text:i}}return Ee(t,r,t[0],this.lexer,this.rules)}}emStrong(n,e,t=""){let s=this.rules.inline.emStrongLDelim.exec(n);if(!(!s||!s[1]&&!s[2]&&!s[3]&&!s[4]||s[4]&&t.match(this.rules.other.unicodeAlphaNumeric))&&(!(s[1]||s[3])||!t||this.rules.inline.punctuation.exec(t))){let r=[...s[0]].length-1,i,a,o=r,l=0,c=s[0][0]==="*"?this.rules.inline.emStrongRDelimAst:this.rules.inline.emStrongRDelimUnd;for(c.lastIndex=0,e=e.slice(-1*n.length+r);(s=c.exec(e))!==null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i)continue;if(a=[...i].length,s[3]||s[4]){o+=a;continue}else if((s[5]||s[6])&&r%3&&!((r+a)%3)){l+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o+l);let h=[...s[0]][0].length,p=n.slice(0,r+s.index+h+a);if(Math.min(r,a)%2){let b=p.slice(1,-1);return{type:"em",raw:p,text:b,tokens:this.lexer.inlineTokens(b)}}let g=p.slice(2,-2);return{type:"strong",raw:p,text:g,tokens:this.lexer.inlineTokens(g)}}}}codespan(n){let e=this.rules.inline.code.exec(n);if(e){let t=e[2].replace(this.rules.other.newLineCharGlobal," "),s=this.rules.other.nonSpaceChar.test(t),r=this.rules.other.startingSpaceChar.test(t)&&this.rules.other.endingSpaceChar.test(t);return s&&r&&(t=t.substring(1,t.length-1)),{type:"codespan",raw:e[0],text:t}}}br(n){let e=this.rules.inline.br.exec(n);if(e)return{type:"br",raw:e[0]}}del(n,e,t=""){let s=this.rules.inline.delLDelim.exec(n);if(s&&(!s[1]||!t||this.rules.inline.punctuation.exec(t))){let r=[...s[0]].length-1,i,a,o=r,l=this.rules.inline.delRDelim;for(l.lastIndex=0,e=e.slice(-1*n.length+r);(s=l.exec(e))!==null;){if(i=s[1]||s[2]||s[3]||s[4]||s[5]||s[6],!i||(a=[...i].length,a!==r))continue;if(s[3]||s[4]){o+=a;continue}if(o-=a,o>0)continue;a=Math.min(a,a+o);let c=[...s[0]][0].length,h=n.slice(0,r+s.index+c+a),p=h.slice(r,-r);return{type:"del",raw:h,text:p,tokens:this.lexer.inlineTokens(p)}}}}autolink(n){let e=this.rules.inline.autolink.exec(n);if(e){let t,s;return e[2]==="@"?(t=e[1],s="mailto:"+t):(t=e[1],s=t),{type:"link",raw:e[0],text:t,href:s,tokens:[{type:"text",raw:t,text:t}]}}}url(n){let e;if(e=this.rules.inline.url.exec(n)){let t,s;if(e[2]==="@")t=e[0],s="mailto:"+t;else{let r;do r=e[0],e[0]=this.rules.inline._backpedal.exec(e[0])?.[0]??"";while(r!==e[0]);t=e[0],e[1]==="www."?s="http://"+e[0]:s=e[0]}return{type:"link",raw:e[0],text:t,href:s,tokens:[{type:"text",raw:t,text:t}]}}}inlineText(n){let e=this.rules.inline.text.exec(n);if(e){let t=this.lexer.state.inRawBlock;return{type:"text",raw:e[0],text:e[0],escaped:t}}}},x=class K{tokens;options;state;inlineQueue;tokenizer;constructor(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||R,this.options.tokenizer=this.options.tokenizer||new O,this.tokenizer=this.options.tokenizer,this.tokenizer.options=this.options,this.tokenizer.lexer=this,this.inlineQueue=[],this.state={inLink:!1,inRawBlock:!1,top:!0};let t={other:m,block:_.normal,inline:z.normal};this.options.pedantic?(t.block=_.pedantic,t.inline=z.pedantic):this.options.gfm&&(t.block=_.gfm,this.options.breaks?t.inline=z.breaks:t.inline=z.gfm),this.tokenizer.rules=t}static get rules(){return{block:_,inline:z}}static lex(e,t){return new K(t).lex(e)}static lexInline(e,t){return new K(t).inlineTokens(e)}lex(e){e=e.replace(m.carriageReturn,`
`),this.blockTokens(e,this.tokens);for(let t=0;t<this.inlineQueue.length;t++){let s=this.inlineQueue[t];this.inlineTokens(s.src,s.tokens)}return this.inlineQueue=[],this.tokens}blockTokens(e,t=[],s=!1){this.tokenizer.lexer=this,this.options.pedantic&&(e=e.replace(m.tabCharGlobal,"    ").replace(m.spaceLine,""));let r=1/0;for(;e;){if(e.length<r)r=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}let i;if(this.options.extensions?.block?.some(o=>(i=o.call({lexer:this},e,t))?(e=e.substring(i.raw.length),t.push(i),!0):!1))continue;if(i=this.tokenizer.space(e)){e=e.substring(i.raw.length);let o=t.at(-1);i.raw.length===1&&o!==void 0?o.raw+=`
`:t.push(i);continue}if(i=this.tokenizer.code(e)){e=e.substring(i.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.at(-1).src=o.text):t.push(i);continue}if(i=this.tokenizer.fences(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.heading(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.hr(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.blockquote(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.list(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.html(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.def(e)){e=e.substring(i.raw.length);let o=t.at(-1);o?.type==="paragraph"||o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.raw,this.inlineQueue.at(-1).src=o.text):this.tokens.links[i.tag]||(this.tokens.links[i.tag]={href:i.href,title:i.title},t.push(i));continue}if(i=this.tokenizer.table(e)){e=e.substring(i.raw.length),t.push(i);continue}if(i=this.tokenizer.lheading(e)){e=e.substring(i.raw.length),t.push(i);continue}let a=e;if(this.options.extensions?.startBlock){let o=1/0,l=e.slice(1),c;this.options.extensions.startBlock.forEach(h=>{c=h.call({lexer:this},l),typeof c=="number"&&c>=0&&(o=Math.min(o,c))}),o<1/0&&o>=0&&(a=e.substring(0,o+1))}if(this.state.top&&(i=this.tokenizer.paragraph(a))){let o=t.at(-1);s&&o?.type==="paragraph"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(i),s=a.length!==e.length,e=e.substring(i.raw.length);continue}if(i=this.tokenizer.text(e)){e=e.substring(i.raw.length);let o=t.at(-1);o?.type==="text"?(o.raw+=(o.raw.endsWith(`
`)?"":`
`)+i.raw,o.text+=`
`+i.text,this.inlineQueue.pop(),this.inlineQueue.at(-1).src=o.text):t.push(i);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return this.state.top=!0,t}inline(e,t=[]){return this.inlineQueue.push({src:e,tokens:t}),t}inlineTokens(e,t=[]){this.tokenizer.lexer=this;let s=e;if(this.tokens.links){let o=Object.keys(this.tokens.links);o.length>0&&(s=s.replace(this.tokenizer.rules.inline.reflinkSearch,l=>o.includes(l.slice(l.lastIndexOf("[")+1,-1))?"["+"a".repeat(l.length-2)+"]":l))}s=s.replace(this.tokenizer.rules.inline.anyPunctuation,"++"),s=s.replace(this.tokenizer.rules.inline.blockSkip,(o,l,c)=>{let h=c?c.length:0;return o.slice(0,h)+"["+"a".repeat(o.length-h-2)+"]"}),s=this.options.hooks?.emStrongMask?.call({lexer:this},s)??s;let r=!1,i="",a=1/0;for(;e;){if(e.length<a)a=e.length;else{this.infiniteLoopError(e.charCodeAt(0));break}r||(i=""),r=!1;let o;if(this.options.extensions?.inline?.some(c=>(o=c.call({lexer:this},e,t))?(e=e.substring(o.raw.length),t.push(o),!0):!1))continue;if(o=this.tokenizer.escape(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.tag(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.link(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.reflink(e,this.tokens.links)){e=e.substring(o.raw.length);let c=t.at(-1);o.type==="text"&&c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):t.push(o);continue}if(o=this.tokenizer.emStrong(e,s,i)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.codespan(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.br(e)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.del(e,s,i)){e=e.substring(o.raw.length),t.push(o);continue}if(o=this.tokenizer.autolink(e)){e=e.substring(o.raw.length),t.push(o);continue}if(!this.state.inLink&&(o=this.tokenizer.url(e))){e=e.substring(o.raw.length),t.push(o);continue}let l=e;if(this.options.extensions?.startInline){let c=1/0,h=e.slice(1),p;this.options.extensions.startInline.forEach(g=>{p=g.call({lexer:this},h),typeof p=="number"&&p>=0&&(c=Math.min(c,p))}),c<1/0&&c>=0&&(l=e.substring(0,c+1))}if(o=this.tokenizer.inlineText(l)){e=e.substring(o.raw.length),o.raw.slice(-1)!=="_"&&(i=o.raw.slice(-1)),r=!0;let c=t.at(-1);c?.type==="text"?(c.raw+=o.raw,c.text+=o.text):t.push(o);continue}if(e){this.infiniteLoopError(e.charCodeAt(0));break}}return t}infiniteLoopError(e){let t="Infinite loop on byte: "+e;if(this.options.silent)console.error(t);else throw new Error(t)}},N=class{options;parser;constructor(n){this.options=n||R}space(n){return""}code({text:n,lang:e,escaped:t}){let s=(e||"").match(m.notSpaceStart)?.[0],r=n.replace(m.endingNewline,"")+`
`;return s?'<pre><code class="language-'+y(s)+'">'+(t?r:y(r,!0))+`</code></pre>
`:"<pre><code>"+(t?r:y(r,!0))+`</code></pre>
`}blockquote({tokens:n}){return`<blockquote>
${this.parser.parse(n)}</blockquote>
`}html({text:n}){return n}def(n){return""}heading({tokens:n,depth:e}){return`<h${e}>${this.parser.parseInline(n)}</h${e}>
`}hr(n){return`<hr>
`}list(n){let e=n.ordered,t=n.start,s="";for(let a=0;a<n.items.length;a++){let o=n.items[a];s+=this.listitem(o)}let r=e?"ol":"ul",i=e&&t!==1?' start="'+t+'"':"";return"<"+r+i+`>
`+s+"</"+r+`>
`}listitem(n){return`<li>${this.parser.parse(n.tokens)}</li>
`}checkbox({checked:n}){return"<input "+(n?'checked="" ':"")+'disabled="" type="checkbox"> '}paragraph({tokens:n}){return`<p>${this.parser.parseInline(n)}</p>
`}table(n){let e="",t="";for(let r=0;r<n.header.length;r++)t+=this.tablecell(n.header[r]);e+=this.tablerow({text:t});let s="";for(let r=0;r<n.rows.length;r++){let i=n.rows[r];t="";for(let a=0;a<i.length;a++)t+=this.tablecell(i[a]);s+=this.tablerow({text:t})}return s&&(s=`<tbody>${s}</tbody>`),`<table>
<thead>
`+e+`</thead>
`+s+`</table>
`}tablerow({text:n}){return`<tr>
${n}</tr>
`}tablecell(n){let e=this.parser.parseInline(n.tokens),t=n.header?"th":"td";return(n.align?`<${t} align="${n.align}">`:`<${t}>`)+e+`</${t}>
`}strong({tokens:n}){return`<strong>${this.parser.parseInline(n)}</strong>`}em({tokens:n}){return`<em>${this.parser.parseInline(n)}</em>`}codespan({text:n}){return`<code>${y(n,!0)}</code>`}br(n){return"<br>"}del({tokens:n}){return`<del>${this.parser.parseInline(n)}</del>`}link({href:n,title:e,tokens:t}){let s=this.parser.parseInline(t),r=we(n);if(r===null)return s;n=r;let i='<a href="'+n+'"';return e&&(i+=' title="'+y(e)+'"'),i+=">"+s+"</a>",i}image({href:n,title:e,text:t,tokens:s}){s&&(t=this.parser.parseInline(s,this.parser.textRenderer));let r=we(n);if(r===null)return y(t);n=r;let i=`<img src="${n}" alt="${y(t)}"`;return e&&(i+=` title="${y(e)}"`),i+=">",i}text(n){return"tokens"in n&&n.tokens?this.parser.parseInline(n.tokens):"escaped"in n&&n.escaped?n.text:y(n.text)}},ie=class{strong({text:n}){return n}em({text:n}){return n}codespan({text:n}){return n}del({text:n}){return n}html({text:n}){return n}text({text:n}){return n}link({text:n}){return""+n}image({text:n}){return""+n}br(){return""}checkbox({raw:n}){return n}},w=class G{options;renderer;textRenderer;constructor(e){this.options=e||R,this.options.renderer=this.options.renderer||new N,this.renderer=this.options.renderer,this.renderer.options=this.options,this.renderer.parser=this,this.textRenderer=new ie}static parse(e,t){return new G(t).parse(e)}static parseInline(e,t){return new G(t).parseInline(e)}parse(e){this.renderer.parser=this;let t="";for(let s=0;s<e.length;s++){let r=e[s];if(this.options.extensions?.renderers?.[r.type]){let a=r,o=this.options.extensions.renderers[a.type].call({parser:this},a);if(o!==!1||!["space","hr","heading","code","table","blockquote","list","html","def","paragraph","text"].includes(a.type)){t+=o||"";continue}}let i=r;switch(i.type){case"space":{t+=this.renderer.space(i);break}case"hr":{t+=this.renderer.hr(i);break}case"heading":{t+=this.renderer.heading(i);break}case"code":{t+=this.renderer.code(i);break}case"table":{t+=this.renderer.table(i);break}case"blockquote":{t+=this.renderer.blockquote(i);break}case"list":{t+=this.renderer.list(i);break}case"checkbox":{t+=this.renderer.checkbox(i);break}case"html":{t+=this.renderer.html(i);break}case"def":{t+=this.renderer.def(i);break}case"paragraph":{t+=this.renderer.paragraph(i);break}case"text":{t+=this.renderer.text(i);break}default:{let a='Token with "'+i.type+'" type was not found.';if(this.options.silent)return console.error(a),"";throw new Error(a)}}}return t}parseInline(e,t=this.renderer){this.renderer.parser=this;let s="";for(let r=0;r<e.length;r++){let i=e[r];if(this.options.extensions?.renderers?.[i.type]){let o=this.options.extensions.renderers[i.type].call({parser:this},i);if(o!==!1||!["escape","html","link","image","strong","em","codespan","br","del","text"].includes(i.type)){s+=o||"";continue}}let a=i;switch(a.type){case"escape":{s+=t.text(a);break}case"html":{s+=t.html(a);break}case"link":{s+=t.link(a);break}case"image":{s+=t.image(a);break}case"checkbox":{s+=t.checkbox(a);break}case"strong":{s+=t.strong(a);break}case"em":{s+=t.em(a);break}case"codespan":{s+=t.codespan(a);break}case"br":{s+=t.br(a);break}case"del":{s+=t.del(a);break}case"text":{s+=t.text(a);break}default:{let o='Token with "'+a.type+'" type was not found.';if(this.options.silent)return console.error(o),"";throw new Error(o)}}}return s}},I=class{options;block;constructor(n){this.options=n||R}static passThroughHooks=new Set(["preprocess","postprocess","processAllTokens","emStrongMask"]);static passThroughHooksRespectAsync=new Set(["preprocess","postprocess","processAllTokens"]);preprocess(n){return n}postprocess(n){return n}processAllTokens(n){return n}emStrongMask(n){return n}provideLexer(n=this.block){return n?x.lex:x.lexInline}provideParser(n=this.block){return n?w.parse:w.parseInline}},oe=class{defaults=X();options=this.setOptions;parse=this.parseMarkdown(!0);parseInline=this.parseMarkdown(!1);Parser=w;Renderer=N;TextRenderer=ie;Lexer=x;Tokenizer=O;Hooks=I;constructor(...n){this.use(...n)}walkTokens(n,e){let t=[];for(let s of n)switch(t=t.concat(e.call(this,s)),s.type){case"table":{let r=s;for(let i of r.header)t=t.concat(this.walkTokens(i.tokens,e));for(let i of r.rows)for(let a of i)t=t.concat(this.walkTokens(a.tokens,e));break}case"list":{let r=s;t=t.concat(this.walkTokens(r.items,e));break}default:{let r=s;this.defaults.extensions?.childTokens?.[r.type]?this.defaults.extensions.childTokens[r.type].forEach(i=>{let a=r[i].flat(1/0);t=t.concat(this.walkTokens(a,e))}):r.tokens&&(t=t.concat(this.walkTokens(r.tokens,e)))}}return t}use(...n){let e=this.defaults.extensions||{renderers:{},childTokens:{}};return n.forEach(t=>{let s={...t};if(s.async=this.defaults.async||s.async||!1,t.extensions&&(t.extensions.forEach(r=>{if(!r.name)throw new Error("extension name required");if("renderer"in r){let i=e.renderers[r.name];i?e.renderers[r.name]=function(...a){let o=r.renderer.apply(this,a);return o===!1&&(o=i.apply(this,a)),o}:e.renderers[r.name]=r.renderer}if("tokenizer"in r){if(!r.level||r.level!=="block"&&r.level!=="inline")throw new Error("extension level must be 'block' or 'inline'");let i=e[r.level];i?i.unshift(r.tokenizer):e[r.level]=[r.tokenizer],r.start&&(r.level==="block"?e.startBlock?e.startBlock.push(r.start):e.startBlock=[r.start]:r.level==="inline"&&(e.startInline?e.startInline.push(r.start):e.startInline=[r.start]))}"childTokens"in r&&r.childTokens&&(e.childTokens[r.name]=r.childTokens)}),s.extensions=e),t.renderer){let r=this.defaults.renderer||new N(this.defaults);for(let i in t.renderer){if(!(i in r))throw new Error(`renderer '${i}' does not exist`);if(["options","parser"].includes(i))continue;let a=i,o=t.renderer[a],l=r[a];r[a]=(...c)=>{let h=o.apply(r,c);return h===!1&&(h=l.apply(r,c)),h||""}}s.renderer=r}if(t.tokenizer){let r=this.defaults.tokenizer||new O(this.defaults);for(let i in t.tokenizer){if(!(i in r))throw new Error(`tokenizer '${i}' does not exist`);if(["options","rules","lexer"].includes(i))continue;let a=i,o=t.tokenizer[a],l=r[a];r[a]=(...c)=>{let h=o.apply(r,c);return h===!1&&(h=l.apply(r,c)),h}}s.tokenizer=r}if(t.hooks){let r=this.defaults.hooks||new I;for(let i in t.hooks){if(!(i in r))throw new Error(`hook '${i}' does not exist`);if(["options","block"].includes(i))continue;let a=i,o=t.hooks[a],l=r[a];I.passThroughHooks.has(i)?r[a]=c=>{if(this.defaults.async&&I.passThroughHooksRespectAsync.has(i))return(async()=>{let p=await o.call(r,c);return l.call(r,p)})();let h=o.call(r,c);return l.call(r,h)}:r[a]=(...c)=>{if(this.defaults.async)return(async()=>{let p=await o.apply(r,c);return p===!1&&(p=await l.apply(r,c)),p})();let h=o.apply(r,c);return h===!1&&(h=l.apply(r,c)),h}}s.hooks=r}if(t.walkTokens){let r=this.defaults.walkTokens,i=t.walkTokens;s.walkTokens=function(a){let o=[];return o.push(i.call(this,a)),r&&(o=o.concat(r.call(this,a))),o}}this.defaults={...this.defaults,...s}}),this}setOptions(n){return this.defaults={...this.defaults,...n},this}lexer(n,e){return x.lex(n,e??this.defaults)}parser(n,e){return w.parse(n,e??this.defaults)}parseMarkdown(n){return(e,t)=>{let s={...t},r={...this.defaults,...s},i=this.onError(!!r.silent,!!r.async);if(this.defaults.async===!0&&s.async===!1)return i(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));if(typeof e>"u"||e===null)return i(new Error("marked(): input parameter is undefined or null"));if(typeof e!="string")return i(new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected"));if(r.hooks&&(r.hooks.options=r,r.hooks.block=n),r.async)return(async()=>{let a=r.hooks?await r.hooks.preprocess(e):e,o=await(r.hooks?await r.hooks.provideLexer(n):n?x.lex:x.lexInline)(a,r),l=r.hooks?await r.hooks.processAllTokens(o):o;r.walkTokens&&await Promise.all(this.walkTokens(l,r.walkTokens));let c=await(r.hooks?await r.hooks.provideParser(n):n?w.parse:w.parseInline)(l,r);return r.hooks?await r.hooks.postprocess(c):c})().catch(i);try{r.hooks&&(e=r.hooks.preprocess(e));let a=(r.hooks?r.hooks.provideLexer(n):n?x.lex:x.lexInline)(e,r);r.hooks&&(a=r.hooks.processAllTokens(a)),r.walkTokens&&this.walkTokens(a,r.walkTokens);let o=(r.hooks?r.hooks.provideParser(n):n?w.parse:w.parseInline)(a,r);return r.hooks&&(o=r.hooks.postprocess(o)),o}catch(a){return i(a)}}}onError(n,e){return t=>{if(t.message+=`
Please report this to https://github.com/markedjs/marked.`,n){let s="<p>An error occurred:</p><pre>"+y(t.message+"",!0)+"</pre>";return e?Promise.resolve(s):s}if(e)return Promise.reject(t);throw t}}},$=new oe;function k(n,e){return $.parse(n,e)}k.options=k.setOptions=function(n){return $.setOptions(n),k.defaults=$.defaults,Te(k.defaults),k};k.getDefaults=X;k.defaults=R;k.use=function(...n){return $.use(...n),k.defaults=$.defaults,Te(k.defaults),k};k.walkTokens=function(n,e){return $.walkTokens(n,e)};k.parseInline=$.parseInline;k.Parser=w;k.parser=w.parse;k.Renderer=N;k.TextRenderer=ie;k.Lexer=x;k.lexer=x.lex;k.Tokenizer=O;k.Hooks=I;k.parse=k;var Gt=k.options,Xt=k.setOptions,Yt=k.use,Jt=k.walkTokens,en=k.parseInline;var tn=w.parse,nn=x.lex;var qt="README.md",Ot="Interactive README Viewer",Nt="interactiveReadmeViewer",ae="interactiveReadmeViewer.suppressGlobalPrompt",U="interactiveReadmeViewer.suppressedWorkspacePaths",jt=250,F;function he(n){F?.appendLine(`[INFO  ${new Date().toISOString()}] ${n}`)}function v(n,e){let t=e instanceof Error?`${e.message}
${e.stack??""}`:e!==void 0?String(e):"";F?.appendLine(`[ERROR ${new Date().toISOString()}] ${n}${t?` :: ${t}`:""}`)}function Ht(n){let e=n.toLowerCase().trim().replace(/[^\w\s-]/g,"").replace(/\s+/g,"-");return e.length>0?e:"section"}function le(n){return n.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Ie(n){let e=[],t=new Map,s=0,r={heading(i){let a=this.parser.parseInline(i.tokens),o=a.replace(/<[^>]+>/g,""),l=Ht(o),c=t.get(l)??0;return t.set(l,c+1),c>0&&(l=`${l}-${c}`),e.push({level:i.depth,text:o,slug:l}),`<h${i.depth} id="${l}" class="scroll-mt-8 group relative"><a href="#${l}" class="toc-anchor absolute -left-5 opacity-0 group-hover:opacity-70 no-underline select-none">#</a>${a}</h${i.depth}>
`},checkbox(i){return`<input type="checkbox" data-checkbox-index="${s++}" ${i.checked?"checked":""} class="task-checkbox align-middle mr-2 cursor-pointer" />`},listitem(i){let a=this.parser.parse(i.tokens);return`<li class="${i.task?"task-list-item list-none flex items-start gap-1":""}">${a}</li>
`},link(i){let a=this.parser.parseInline(i.tokens),l=/^https?:\/\//i.test(i.href)?' target="_blank" rel="noopener noreferrer" class="external-link"':"",c=i.title?` title="${le(i.title)}"`:"";return`<a href="${i.href}"${l}${c}>${a}</a>`},image(i){let a=i.text?le(i.text):"",o=i.title?` title="${le(i.title)}"`:"";return`<img src="${i.href}" alt="${a}"${o} class="max-w-full rounded-md" loading="lazy" />`}};try{let i=new oe({gfm:!0,breaks:!1});return i.use({renderer:r}),{html:i.parse(n,{async:!1}),toc:e}}catch(i){throw v("Markdown parsing failed.",i),i}}var Oe=/^(\s*[-*+]\s\[)([ xX])(\]\s.*)$/;function Ut(n,e){let t=n.split(/\r?\n/),s=0;for(let r=0;r<t.length;r++)if(Oe.test(t[r])){if(s===e)return r;s++}}async function Ft(n,e,t){let s=Ut(n.getText(),e);if(s===void 0)return v(`Could not resolve checkbox index ${e} to a source line (document may have changed).`),!1;let r=n.lineAt(s),i=Oe.exec(r.text);if(!i)return v(`Line ${s} no longer matches the expected checkbox pattern.`),!1;let[,a,,o]=i,l=`${a}${t?"x":" "}${o}`,c=new u.WorkspaceEdit;c.replace(n.uri,r.range,l);try{return await u.workspace.applyEdit(c)}catch(h){return v("Failed to apply checkbox toggle edit.",h),!1}}var ce=class{constructor(e){this.globalState=e}currentWorkspaceKey(){return u.workspace.workspaceFolders?.[0]?.uri.toString()}isSuppressed(){let e=this.currentWorkspaceKey();return e?this.globalState.get(U,[]).includes(e):this.globalState.get(ae,!1)}async suppress(){let e=this.currentWorkspaceKey();if(e){let t=this.globalState.get(U,[]);t.includes(e)||await this.globalState.update(U,[...t,e])}else await this.globalState.update(ae,!0)}async reset(){await this.globalState.update(U,[]),await this.globalState.update(ae,!1)}};function De(){let n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e="";for(let t=0;t<32;t++)e+=n.charAt(Math.floor(Math.random()*n.length));return e}function Me(n){switch(n){case u.ColorThemeKind.Light:return"light";case u.ColorThemeKind.HighContrast:case u.ColorThemeKind.HighContrastLight:return"high-contrast";default:return"dark"}}var A=class n{static currentPanel;static viewType="interactiveReadmeViewer.panel";panel;disposables=[];documentUri;updateTimer;static createOrShow(e,t,s){let r=s?u.ViewColumn.Beside:u.ViewColumn.Active;if(n.currentPanel){n.currentPanel.panel.reveal(r),n.currentPanel.setDocument(t);return}let i=u.window.createWebviewPanel(n.viewType,`Preview: ${C.basename(t.fileName)}`,r,{enableScripts:!0,retainContextWhenHidden:!0,localResourceRoots:[u.Uri.joinPath(e,"media"),u.Uri.joinPath(e,"dist")]});n.currentPanel=new n(i,t)}constructor(e,t){this.panel=e,this.documentUri=t.uri;try{let{html:s,toc:r}=Ie(t.getText()),i=De();this.panel.webview.html=Z(s,i,this.panel.webview.cspSource,r,C.basename(t.fileName))}catch(s){v("Failed to build initial webview content.",s),this.panel.webview.html=Z('<p class="text-red-400">Failed to render this document. See the output channel for details.</p>',De(),this.panel.webview.cspSource,[],C.basename(t.fileName))}this.panel.webview.onDidReceiveMessage(s=>void this.handleMessage(s),void 0,this.disposables),this.panel.onDidDispose(()=>this.dispose(),void 0,this.disposables),u.window.onDidChangeActiveColorTheme(s=>this.postMessage({type:"themeChanged",kind:Me(s.kind)}),void 0,this.disposables)}setDocument(e){this.documentUri=e.uri,this.panel.title=`Preview: ${C.basename(e.fileName)}`,this.renderAndPost(e)}matchesDocument(e){return this.documentUri.toString()===e.toString()}scheduleUpdate(e){this.updateTimer&&clearTimeout(this.updateTimer),this.updateTimer=setTimeout(()=>this.renderAndPost(e),jt)}renderAndPost(e){try{let{html:t,toc:s}=Ie(e.getText());this.postMessage({type:"update",html:t,toc:s,fileName:C.basename(e.fileName)})}catch(t){v("Failed to render markdown for webview update.",t),this.postMessage({type:"error",message:'Failed to render this Markdown document. See the "Interactive README Viewer" output channel.'})}}postMessage(e){this.panel.webview.postMessage(e).then(void 0,t=>{v("Failed to post message to webview.",t)})}async handleMessage(e){try{switch(e.type){case"ready":{this.postMessage({type:"themeChanged",kind:Me(u.window.activeColorTheme.kind)});break}case"toggleCheckbox":{let t=await u.workspace.openTextDocument(this.documentUri);await Ft(t,e.index,e.checked)||this.postMessage({type:"error",message:"Could not update that checklist item in the source file."});break}case"openExternal":{await u.env.openExternal(u.Uri.parse(e.href));break}case"clientLog":{he(`[webview:${e.level}] ${e.message}`);break}default:v(`Received unknown message type from webview: ${JSON.stringify(e)}`)}}catch(t){v("Error handling message from webview.",t)}}dispose(){for(n.currentPanel=void 0,this.updateTimer&&clearTimeout(this.updateTimer),this.panel.dispose();this.disposables.length;)this.disposables.pop()?.dispose()}};function pe(n){return C.basename(n.fileName)===qt}async function _e(n,e,t){try{let s;if(e)s=await u.workspace.openTextDocument(e);else if(u.window.activeTextEditor&&pe(u.window.activeTextEditor.document))s=u.window.activeTextEditor.document;else{let r=await u.workspace.findFiles("**/README.md","**/node_modules/**",1);if(r.length===0){u.window.showWarningMessage("No README.md file was found in this workspace.");return}s=await u.workspace.openTextDocument(r[0])}A.createOrShow(n.extensionUri,s,t)}catch(s){v("Failed to open the Interactive README Viewer.",s),u.window.showErrorMessage("Interactive README Viewer failed to open. Check the output channel for details.")}}async function qe(n,e,t){if(!u.workspace.getConfiguration(Nt).get("autoPromptOnOpen",!0)||t.isSuppressed()||A.currentPanel?.matchesDocument(e.uri))return;let r="Open Interactive Viewer",i="Don't Show Again";try{let a=await u.window.showInformationMessage("This looks like a README. Want the interactive, themed viewer instead of the plain preview?",r,i);a===r?A.createOrShow(n.extensionUri,e,!1):a===i&&(await t.suppress(),he("User disabled the Interactive README Viewer prompt for this workspace."))}catch(a){v("Failed to show the proactive README prompt.",a)}}function Wt(n){F=u.window.createOutputChannel(Ot),n.subscriptions.push(F),he("Interactive README Viewer activated.");let e=new ce(n.globalState),t=u.commands.registerCommand("interactiveReadmeViewer.open",o=>{_e(n,o,!1)}),s=u.commands.registerCommand("interactiveReadmeViewer.openToSide",o=>{_e(n,o,!0)}),r=u.commands.registerCommand("interactiveReadmeViewer.resetPromptSuppression",async()=>{await e.reset(),u.window.showInformationMessage("Interactive README Viewer: prompt suppression has been reset.")}),i=u.window.onDidChangeActiveTextEditor(o=>{o&&pe(o.document)&&qe(n,o.document,e)}),a=u.workspace.onDidChangeTextDocument(o=>{let l=A.currentPanel;l&&l.matchesDocument(o.document.uri)&&l.scheduleUpdate(o.document)});n.subscriptions.push(t,s,r,i,a),u.window.activeTextEditor&&pe(u.window.activeTextEditor.document)&&qe(n,u.window.activeTextEditor.document,e)}function Vt(){A.currentPanel?.dispose()}0&&(module.exports={activate,deactivate});
