const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

function copyHighlightThemes() {
  const mediaDir = path.join(__dirname, 'media');
  fs.mkdirSync(mediaDir, { recursive: true });

  const filesToCopy = [
    ['node_modules/highlight.js/styles/atom-one-dark.css', 'media/hljs-atom-one-dark.css'],
    ['node_modules/highlight.js/styles/atom-one-light.css', 'media/hljs-atom-one-light.css'],
  ];

  for (const [src, dest] of filesToCopy) {
    fs.copyFileSync(path.join(__dirname, src), path.join(__dirname, dest));
  }
}

async function main() {
  copyHighlightThemes();

  const extensionCtx = await esbuild.context({
    entryPoints: ['src/extension.ts'],
    bundle: true,
    format: 'cjs',
    minify: production,
    sourcemap: !production,
    sourcesContent: false,
    platform: 'node',
    outfile: 'dist/extension.js',
    external: ['vscode'],
    logLevel: 'info',
  });

  // Bundles highlight.js (core + common languages) into a single browser-ready
  // file that ships inside the extension — no CDN fetch at runtime, ever.
  const highlightCtx = await esbuild.context({
    entryPoints: ['highlight.js'],
    bundle: true,
    format: 'iife',
    globalName: 'hljs',
    minify: true,
    platform: 'browser',
    outfile: 'media/highlight.bundle.js',
    logLevel: 'info',
  });

  if (watch) {
    await Promise.all([extensionCtx.watch(), highlightCtx.watch()]);
  } else {
    await Promise.all([extensionCtx.rebuild(), highlightCtx.rebuild()]);
    await extensionCtx.dispose();
    await highlightCtx.dispose();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});