import * as vscode from 'vscode';
import * as path from 'path';
import { getWebviewContent, type TocEntry } from './webviewHtml';
import { Marked, type Tokens, type RendererObject } from 'marked';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const README_EXACT_FILENAME = 'README.md';
const OUTPUT_CHANNEL_NAME = 'Interactive README Viewer';
const CONFIG_SECTION = 'interactiveReadmeViewer';
const SUPPRESS_GLOBAL_KEY = 'interactiveReadmeViewer.suppressGlobalPrompt';
const SUPPRESS_WORKSPACES_KEY = 'interactiveReadmeViewer.suppressedWorkspacePaths';
const HOT_RELOAD_DEBOUNCE_MS = 250;

// ---------------------------------------------------------------------------
// Output channel / logging
// ---------------------------------------------------------------------------

let outputChannel: vscode.OutputChannel;

function logInfo(message: string): void {
  outputChannel?.appendLine(`[INFO  ${new Date().toISOString()}] ${message}`);
}

function logError(message: string, error?: unknown): void {
  const details =
    error instanceof Error ? `${error.message}\n${error.stack ?? ''}` : error !== undefined ? String(error) : '';
  outputChannel?.appendLine(`[ERROR ${new Date().toISOString()}] ${message}${details ? ` :: ${details}` : ''}`);
}

// ---------------------------------------------------------------------------
// Message contracts (backend <-> webview)
// ---------------------------------------------------------------------------

type ExtensionToWebviewMessage =
  | { type: 'update'; html: string; toc: TocEntry[]; fileName: string }
  | { type: 'themeChanged'; kind: 'light' | 'dark' | 'high-contrast' }
  | { type: 'error'; message: string };

type WebviewToExtensionMessage =
  | { type: 'ready' }
  | { type: 'toggleCheckbox'; index: number; checked: boolean }
  | { type: 'openExternal'; href: string }
  | { type: 'clientLog'; level: 'info' | 'warn' | 'error'; message: string };

// ---------------------------------------------------------------------------
// Markdown rendering (single source of truth for parsing)
// ---------------------------------------------------------------------------

interface RenderResult {
  html: string;
  toc: TocEntry[];
}

function slugify(raw: string): string {
  const slug = raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
  return slug.length > 0 ? slug : 'section';
}

function escapeHtmlAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Renders markdown to HTML using a fresh `Marked` instance per call (rather than
 * mutating the global `marked` singleton via `marked.use()`), so repeated calls
 * during hot-reload never leak stacked renderer overrides.
 */
function renderMarkdown(markdownText: string): RenderResult {
  const toc: TocEntry[] = [];
  const slugCounts = new Map<string, number>();
  let checkboxCounter = 0;

  const renderer: RendererObject = {
    heading(token: Tokens.Heading): string {
      const text = this.parser.parseInline(token.tokens);
      const plainText = text.replace(/<[^>]+>/g, '');
      let slug = slugify(plainText);
      const seen = slugCounts.get(slug) ?? 0;
      slugCounts.set(slug, seen + 1);
      if (seen > 0) {
        slug = `${slug}-${seen}`;
      }
      toc.push({ level: token.depth, text: plainText, slug });
      return (
        `<h${token.depth} id="${slug}" class="scroll-mt-8 group relative">` +
        `<a href="#${slug}" class="toc-anchor absolute -left-5 opacity-0 group-hover:opacity-70 no-underline select-none">#</a>` +
        `${text}</h${token.depth}>\n`
      );
    },

    // Called once per task-list item; this is the hook we use to stamp a stable,
    // document-order index onto each checkbox so toggles can be mapped back to
    // the exact source line without re-parsing the whole tree.
    checkbox(token: Tokens.Checkbox): string {
      const index = checkboxCounter++;
      return `<input type="checkbox" data-checkbox-index="${index}" ${
        token.checked ? 'checked' : ''
      } class="task-checkbox align-middle mr-2 cursor-pointer" />`;
    },

    listitem(token: Tokens.ListItem): string {
      const body = this.parser.parse(token.tokens);
      const cssClass = token.task ? 'task-list-item list-none flex items-start gap-1' : '';
      return `<li class="${cssClass}">${body}</li>\n`;
    },

    link(token: Tokens.Link): string {
      const text = this.parser.parseInline(token.tokens);
      const isExternal = /^https?:\/\//i.test(token.href);
      const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer" class="external-link"' : '';
      const titleAttr = token.title ? ` title="${escapeHtmlAttribute(token.title)}"` : '';
      return `<a href="${token.href}"${attrs}${titleAttr}>${text}</a>`;
    },

    image(token: Tokens.Image): string {
      const altAttr = token.text ? escapeHtmlAttribute(token.text) : '';
      const titleAttr = token.title ? ` title="${escapeHtmlAttribute(token.title)}"` : '';
      return `<img src="${token.href}" alt="${altAttr}"${titleAttr} class="max-w-full rounded-md" loading="lazy" />`;
    },
  };

  try {
    const instance = new Marked({ gfm: true, breaks: false });
    instance.use({ renderer });
    const html = instance.parse(markdownText, { async: false }) as string;
    return { html, toc };
  } catch (error) {
    logError('Markdown parsing failed.', error);
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Checkbox line mapping & source mutation
// ---------------------------------------------------------------------------

// Matches GFM unordered task-list lines: "  - [ ] some text" / "* [x] done".
// The Nth match (0-indexed, top-to-bottom) corresponds to the Nth checkbox
// emitted by the renderer above, since marked walks tokens in document order.
const CHECKBOX_LINE_REGEX = /^(\s*[-*+]\s\[)([ xX])(\]\s.*)$/;

function findCheckboxLineNumber(documentText: string, checkboxIndex: number): number | undefined {
  const lines = documentText.split(/\r?\n/);
  let counter = 0;
  for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
    if (CHECKBOX_LINE_REGEX.test(lines[lineNumber])) {
      if (counter === checkboxIndex) {
        return lineNumber;
      }
      counter++;
    }
  }
  return undefined;
}

async function applyCheckboxToggle(
  document: vscode.TextDocument,
  checkboxIndex: number,
  checked: boolean
): Promise<boolean> {
  const lineNumber = findCheckboxLineNumber(document.getText(), checkboxIndex);
  if (lineNumber === undefined) {
    logError(`Could not resolve checkbox index ${checkboxIndex} to a source line (document may have changed).`);
    return false;
  }

  const line = document.lineAt(lineNumber);
  const match = CHECKBOX_LINE_REGEX.exec(line.text);
  if (!match) {
    logError(`Line ${lineNumber} no longer matches the expected checkbox pattern.`);
    return false;
  }

  const [, prefix, , suffix] = match;
  const newLineText = `${prefix}${checked ? 'x' : ' '}${suffix}`;

  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, line.range, newLineText);

  try {
    return await vscode.workspace.applyEdit(edit);
  } catch (error) {
    logError('Failed to apply checkbox toggle edit.', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Suppression engine ("Don't show again")
// ---------------------------------------------------------------------------

class PromptSuppressionManager {
  constructor(private readonly globalState: vscode.Memento) {}

  private currentWorkspaceKey(): string | undefined {
    return vscode.workspace.workspaceFolders?.[0]?.uri.toString();
  }

  isSuppressed(): boolean {
    const workspaceKey = this.currentWorkspaceKey();
    if (workspaceKey) {
      const suppressed = this.globalState.get<string[]>(SUPPRESS_WORKSPACES_KEY, []);
      return suppressed.includes(workspaceKey);
    }
    return this.globalState.get<boolean>(SUPPRESS_GLOBAL_KEY, false);
  }

  async suppress(): Promise<void> {
    const workspaceKey = this.currentWorkspaceKey();
    if (workspaceKey) {
      const suppressed = this.globalState.get<string[]>(SUPPRESS_WORKSPACES_KEY, []);
      if (!suppressed.includes(workspaceKey)) {
        await this.globalState.update(SUPPRESS_WORKSPACES_KEY, [...suppressed, workspaceKey]);
      }
    } else {
      await this.globalState.update(SUPPRESS_GLOBAL_KEY, true);
    }
  }

  async reset(): Promise<void> {
    await this.globalState.update(SUPPRESS_WORKSPACES_KEY, []);
    await this.globalState.update(SUPPRESS_GLOBAL_KEY, false);
  }
}

// ---------------------------------------------------------------------------
// Webview panel management
// ---------------------------------------------------------------------------

function generateNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function themeKindToString(kind: vscode.ColorThemeKind): 'light' | 'dark' | 'high-contrast' {
  switch (kind) {
    case vscode.ColorThemeKind.Light:
      return 'light';
    case vscode.ColorThemeKind.HighContrast:
    case vscode.ColorThemeKind.HighContrastLight:
      return 'high-contrast';
    default:
      return 'dark';
  }
}

class InteractiveReadmePanel {
  public static currentPanel: InteractiveReadmePanel | undefined;
  private static readonly viewType = 'interactiveReadmeViewer.panel';

  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];
  private documentUri: vscode.Uri;
  private updateTimer: ReturnType<typeof setTimeout> | undefined;

  public static createOrShow(extensionUri: vscode.Uri, document: vscode.TextDocument, showToSide: boolean): void {
    const column = showToSide ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active;

    if (InteractiveReadmePanel.currentPanel) {
      InteractiveReadmePanel.currentPanel.panel.reveal(column);
      InteractiveReadmePanel.currentPanel.setDocument(document);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      InteractiveReadmePanel.viewType,
      `Preview: ${path.basename(document.fileName)}`,
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media'), vscode.Uri.joinPath(extensionUri, 'dist')],
      }
    );

    InteractiveReadmePanel.currentPanel = new InteractiveReadmePanel(panel, document);
  }

  private constructor(panel: vscode.WebviewPanel, document: vscode.TextDocument) {
    this.panel = panel;
    this.documentUri = document.uri;

    try {
      const { html, toc } = renderMarkdown(document.getText());
      const nonce = generateNonce();
      this.panel.webview.html = getWebviewContent(
        html,
        nonce,
        this.panel.webview.cspSource,
        toc,
        path.basename(document.fileName)
      );
    } catch (error) {
      logError('Failed to build initial webview content.', error);
      this.panel.webview.html = getWebviewContent(
        '<p class="text-red-400">Failed to render this document. See the output channel for details.</p>',
        generateNonce(),
        this.panel.webview.cspSource,
        [],
        path.basename(document.fileName)
      );
    }

    this.panel.webview.onDidReceiveMessage(
      (message: WebviewToExtensionMessage) => void this.handleMessage(message),
      undefined,
      this.disposables
    );

    this.panel.onDidDispose(() => this.dispose(), undefined, this.disposables);

    vscode.window.onDidChangeActiveColorTheme(
      (theme) => this.postMessage({ type: 'themeChanged', kind: themeKindToString(theme.kind) }),
      undefined,
      this.disposables
    );
  }

  public setDocument(document: vscode.TextDocument): void {
    this.documentUri = document.uri;
    this.panel.title = `Preview: ${path.basename(document.fileName)}`;
    this.renderAndPost(document);
  }

  public matchesDocument(uri: vscode.Uri): boolean {
    return this.documentUri.toString() === uri.toString();
  }

  /** Debounced hot-reload entry point, called from the onDidChangeTextDocument listener. */
  public scheduleUpdate(document: vscode.TextDocument): void {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    this.updateTimer = setTimeout(() => this.renderAndPost(document), HOT_RELOAD_DEBOUNCE_MS);
  }

  private renderAndPost(document: vscode.TextDocument): void {
    try {
      const { html, toc } = renderMarkdown(document.getText());
      this.postMessage({ type: 'update', html, toc, fileName: path.basename(document.fileName) });
    } catch (error) {
      logError('Failed to render markdown for webview update.', error);
      this.postMessage({
        type: 'error',
        message: 'Failed to render this Markdown document. See the "Interactive README Viewer" output channel.',
      });
    }
  }

  private postMessage(message: ExtensionToWebviewMessage): void {
    this.panel.webview.postMessage(message).then(undefined, (error) => {
      logError('Failed to post message to webview.', error);
    });
  }

  private async handleMessage(message: WebviewToExtensionMessage): Promise<void> {
    try {
      switch (message.type) {
        case 'ready': {
          this.postMessage({ type: 'themeChanged', kind: themeKindToString(vscode.window.activeColorTheme.kind) });
          break;
        }
        case 'toggleCheckbox': {
          const document = await vscode.workspace.openTextDocument(this.documentUri);
          const success = await applyCheckboxToggle(document, message.index, message.checked);
          if (!success) {
            this.postMessage({ type: 'error', message: 'Could not update that checklist item in the source file.' });
          }
          // No manual re-render here: applyEdit fires onDidChangeTextDocument,
          // which drives the hot-reload path and keeps the file as the single
          // source of truth.
          break;
        }
        case 'openExternal': {
          await vscode.env.openExternal(vscode.Uri.parse(message.href));
          break;
        }
        case 'clientLog': {
          logInfo(`[webview:${message.level}] ${message.message}`);
          break;
        }
        default: {
          const exhaustiveCheck: never = message;
          logError(`Received unknown message type from webview: ${JSON.stringify(exhaustiveCheck)}`);
        }
      }
    } catch (error) {
      logError('Error handling message from webview.', error);
    }
  }

  public dispose(): void {
    InteractiveReadmePanel.currentPanel = undefined;
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    this.panel.dispose();
    while (this.disposables.length) {
      this.disposables.pop()?.dispose();
    }
  }
}

// ---------------------------------------------------------------------------
// Command handlers & activation
// ---------------------------------------------------------------------------

function isReadmeDocument(document: vscode.TextDocument): boolean {
  return path.basename(document.fileName) === README_EXACT_FILENAME;
}

async function openReadmeFromUriOrActive(
  context: vscode.ExtensionContext,
  uri: vscode.Uri | undefined,
  showToSide: boolean
): Promise<void> {
  try {
    let document: vscode.TextDocument;
    if (uri) {
      document = await vscode.workspace.openTextDocument(uri);
    } else if (vscode.window.activeTextEditor && isReadmeDocument(vscode.window.activeTextEditor.document)) {
      document = vscode.window.activeTextEditor.document;
    } else {
      const found = await vscode.workspace.findFiles('**/README.md', '**/node_modules/**', 1);
      if (found.length === 0) {
        vscode.window.showWarningMessage('No README.md file was found in this workspace.');
        return;
      }
      document = await vscode.workspace.openTextDocument(found[0]);
    }
    InteractiveReadmePanel.createOrShow(context.extensionUri, document, showToSide);
  } catch (error) {
    logError('Failed to open the Interactive README Viewer.', error);
    vscode.window.showErrorMessage('Interactive README Viewer failed to open. Check the output channel for details.');
  }
}

async function maybePromptToOpenViewer(
  context: vscode.ExtensionContext,
  document: vscode.TextDocument,
  suppressionManager: PromptSuppressionManager
): Promise<void> {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION);
  if (!config.get<boolean>('autoPromptOnOpen', true)) {
    return;
  }
  if (suppressionManager.isSuppressed()) {
    return;
  }
  if (InteractiveReadmePanel.currentPanel?.matchesDocument(document.uri)) {
    return;
  }

  const openAction = 'Open Interactive Viewer';
  const dontShowAgainAction = "Don't Show Again";

  try {
    const selection = await vscode.window.showInformationMessage(
      'This looks like a README. Want the interactive, themed viewer instead of the plain preview?',
      openAction,
      dontShowAgainAction
    );

    if (selection === openAction) {
      InteractiveReadmePanel.createOrShow(context.extensionUri, document, false);
    } else if (selection === dontShowAgainAction) {
      await suppressionManager.suppress();
      logInfo('User disabled the Interactive README Viewer prompt for this workspace.');
    }
  } catch (error) {
    logError('Failed to show the proactive README prompt.', error);
  }
}

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
  context.subscriptions.push(outputChannel);
  logInfo('Interactive README Viewer activated.');

  const suppressionManager = new PromptSuppressionManager(context.globalState);

  const openCommand = vscode.commands.registerCommand('interactiveReadmeViewer.open', (uri?: vscode.Uri) => {
    void openReadmeFromUriOrActive(context, uri, false);
  });

  const openToSideCommand = vscode.commands.registerCommand(
    'interactiveReadmeViewer.openToSide',
    (uri?: vscode.Uri) => {
      void openReadmeFromUriOrActive(context, uri, true);
    }
  );

  const resetSuppressionCommand = vscode.commands.registerCommand(
    'interactiveReadmeViewer.resetPromptSuppression',
    async () => {
      await suppressionManager.reset();
      vscode.window.showInformationMessage('Interactive README Viewer: prompt suppression has been reset.');
    }
  );

  const activeEditorListener = vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor && isReadmeDocument(editor.document)) {
      void maybePromptToOpenViewer(context, editor.document, suppressionManager);
    }
  });

  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const panel = InteractiveReadmePanel.currentPanel;
    if (panel && panel.matchesDocument(event.document.uri)) {
      panel.scheduleUpdate(event.document);
    }
  });

  context.subscriptions.push(
    openCommand,
    openToSideCommand,
    resetSuppressionCommand,
    activeEditorListener,
    changeListener
  );

  // Catch the case where the extension activates while a README is already focused.
  if (vscode.window.activeTextEditor && isReadmeDocument(vscode.window.activeTextEditor.document)) {
    void maybePromptToOpenViewer(context, vscode.window.activeTextEditor.document, suppressionManager);
  }
}

export function deactivate(): void {
  InteractiveReadmePanel.currentPanel?.dispose();
}