type CodeBlockProps = {
  children: string;
  filename?: string;
  language?: string;
};

const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  'true',
  'false',
  'null',
  'undefined',
  'async',
  'await',
  'new',
  'class',
  'extends',
  'type',
  'interface',
  'as',
  'default',
  'void',
]);

const TOKEN_PATTERN =
  /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|[{}()[\].,:;=+\-*/<>?&|!]+)/g;

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tokenClass(source: string, token: string, index: number) {
  if (token.startsWith('//') || token.startsWith('/*')) {
    return 'tok-comment';
  }

  if (token.startsWith("'") || token.startsWith('"') || token.startsWith('`')) {
    return 'tok-string';
  }

  if (/^\d/.test(token)) {
    return 'tok-number';
  }

  if (/^[{}()[\].,:;=+\-*/<>?&|!]+$/.test(token)) {
    return 'tok-punctuation';
  }

  if (KEYWORDS.has(token)) {
    return 'tok-keyword';
  }

  const previous = source.slice(0, index).trimEnd().at(-1);
  const next = source
    .slice(index + token.length)
    .trimStart()
    .at(0);

  if (next === '(') {
    return 'tok-fn';
  }

  if (previous === '.' || next === ':') {
    return 'tok-property';
  }

  if (/^[A-Z]/.test(token)) {
    return 'tok-type';
  }

  return null;
}

function highlight(source: string) {
  let html = '';
  let cursor = 0;

  for (const match of source.matchAll(TOKEN_PATTERN)) {
    const token = match[0];
    const index = match.index ?? 0;
    const className = tokenClass(source, token, index);

    html += escapeHtml(source.slice(cursor, index));
    html += className
      ? `<span class="${className}">${escapeHtml(token)}</span>`
      : escapeHtml(token);
    cursor = index + token.length;
  }

  html += escapeHtml(source.slice(cursor));

  return html;
}

export function HighlightedCode({ children }: { children: string }) {
  const html = highlight(children.trim());

  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted static documentation markup
    <code dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function CodeBlock({ children, filename, language = 'tsx' }: CodeBlockProps) {
  return (
    <div className="code-block">
      {filename ? (
        <div className="code-block__head">
          {filename} · {language}
        </div>
      ) : null}
      <pre>
        <HighlightedCode>{children}</HighlightedCode>
      </pre>
    </div>
  );
}
