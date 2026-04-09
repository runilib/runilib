'use client';

import type React from 'react';
import { useCallback, useState } from 'react';

import styled from 'styled-components';

const C = {
  keyword: '#c792ea',
  string: '#c3e88d',
  template: '#c3e88d',
  comment: '#546e7a',
  funcName: '#82aaff',
  typeName: '#ffcb6b',
  attrName: '#89ddff',
  tagName: '#f07178',
  number: '#f78c6c',
  boolean: '#ff9cac',
  operator: '#89ddff',
  punct: '#89ddff',
  plain: '#a6accd',
  regex: '#ff5370',
} as const;

type TokenType = keyof typeof C;

interface Token {
  type: TokenType;
  value: string;
}

const KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'default',
  'as',
  'const',
  'let',
  'var',
  'function',
  'class',
  'new',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'try',
  'catch',
  'finally',
  'throw',
  'async',
  'await',
  'type',
  'interface',
  'extends',
  'implements',
  'abstract',
  'public',
  'private',
  'protected',
  'readonly',
  'static',
  'enum',
  'namespace',
  'declare',
  'module',
  'typeof',
  'instanceof',
  'in',
  'of',
  'keyof',
  'void',
  'never',
  'any',
  'unknown',
  'this',
  'super',
  'satisfies',
]);

const BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']);

const BUILTINS = new Set([
  'console',
  'Math',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Date',
  'Promise',
  'Map',
  'Set',
  'Error',
  'JSON',
  'window',
  'document',
  'React',
  'useState',
  'useEffect',
  'useRef',
  'useMemo',
  'useCallback',
  'useContext',
  'useReducer',
  'forwardRef',
  'createContext',
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const value = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value });
      i += value.length;
      continue;
    }

    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const value = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value });
      i += value.length;
      continue;
    }

    if (code[i] === '`') {
      let value = '`';
      i += 1;

      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') {
          value += code[i] + (code[i + 1] || '');
          i += 2;
          continue;
        }

        value += code[i];
        i += 1;
      }

      value += '`';
      i += 1;
      tokens.push({ type: 'template', value });
      continue;
    }

    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let value = quote;
      i += 1;

      while (i < code.length && code[i] !== quote && code[i] !== '\n') {
        if (code[i] === '\\') {
          value += code[i] + (code[i + 1] || '');
          i += 2;
          continue;
        }

        value += code[i];
        i += 1;
      }

      value += quote;
      i += 1;
      tokens.push({ type: 'string', value });
      continue;
    }

    if (/\d/.test(code[i]) || (code[i] === '.' && /\d/.test(code[i + 1] || ''))) {
      let value = '';

      while (i < code.length && /[\d._xXa-fA-F]/.test(code[i])) {
        value += code[i];
        i += 1;
      }

      tokens.push({ type: 'number', value });
      continue;
    }

    if (/[a-zA-Z_$]/.test(code[i])) {
      let value = '';

      while (i < code.length && /[\w$]/.test(code[i])) {
        value += code[i];
        i += 1;
      }

      const nextNonSpace = code.slice(i).match(/^[ \t]*(.)/)?.[1];
      const prevChar =
        tokens.length > 0 ? tokens[tokens.length - 1].value.trimEnd().slice(-1) : '';

      if (KEYWORDS.has(value)) {
        tokens.push({ type: 'keyword', value });
      } else if (BOOLEANS.has(value)) {
        tokens.push({ type: 'boolean', value });
      } else if (
        BUILTINS.has(value) ||
        (value[0] === value[0].toUpperCase() && prevChar !== '.')
      ) {
        if (nextNonSpace === '(') {
          tokens.push({ type: 'funcName', value });
        } else if (/^[A-Z]/.test(value)) {
          tokens.push({ type: 'typeName', value });
        } else {
          tokens.push({ type: 'funcName', value });
        }
      } else if (nextNonSpace === '(') {
        tokens.push({ type: 'funcName', value });
      } else if (
        prevChar === '<' ||
        (prevChar === '/' && tokens[tokens.length - 2]?.value === '<')
      ) {
        tokens.push({ type: 'tagName', value });
      } else {
        tokens.push({ type: 'plain', value });
      }

      continue;
    }

    if (code[i] === '<' && /[A-Za-z/!]/.test(code[i + 1] || '')) {
      tokens.push({ type: 'punct', value: code[i] });
      i += 1;
      continue;
    }

    if ('{}()[].,:;!?@#'.includes(code[i])) {
      tokens.push({ type: 'punct', value: code[i] });
      i += 1;
      continue;
    }

    if ('=><>|&+-*/%^~'.includes(code[i])) {
      let value = code[i];
      i += 1;

      if (
        (value === '=' || value === '!' || value === '<' || value === '>') &&
        code[i] === '='
      ) {
        value += code[i];
        i += 1;
      }

      if (value === '=' && code[i] === '>') {
        value += code[i];
        i += 1;
      }

      tokens.push({ type: 'operator', value });
      continue;
    }

    if (code[i] === '\n') {
      tokens.push({ type: 'plain', value: '\n' });
      i += 1;
      continue;
    }

    if (/\s/.test(code[i])) {
      let value = '';

      while (i < code.length && code[i] !== '\n' && /\s/.test(code[i])) {
        value += code[i];
        i += 1;
      }

      tokens.push({ type: 'plain', value });
      continue;
    }

    tokens.push({ type: 'plain', value: code[i] });
    i += 1;
  }

  return tokens;
}

function renderLine(line: string, lang: string): React.ReactNode {
  if (lang === 'bash') {
    const [command, ...rest] = line.split(' ');

    if (command === '#') {
      return <span style={{ color: C.comment }}>{line}</span>;
    }

    const isCommand = [
      'npm',
      'yarn',
      'pnpm',
      'npx',
      'git',
      'cd',
      'echo',
      'export',
    ].includes(command);

    if (isCommand) {
      return (
        <>
          <span style={{ color: C.funcName }}>{command}</span>
          {rest.length > 0 ? (
            <span style={{ color: C.plain }}> {rest.join(' ')}</span>
          ) : null}
        </>
      );
    }

    return <span style={{ color: C.plain }}>{line}</span>;
  }

  const tokens = tokenize(line);
  let cursor = 0;

  return tokens.map((token) => {
    const key = `${token.type}:${cursor}:${token.value}`;
    cursor += token.value.length;

    return (
      <span
        key={key}
        style={{ color: C[token.type] }}
      >
        {token.value}
      </span>
    );
  });
}

type CodeBlockProps = {
  code: string;
  lang?: string;
  filename?: string;
  maxHeight?: string;
  showLines?: boolean;
};

export const CodeBlock = ({
  code,
  lang = 'tsx',
  filename,
  maxHeight,
  showLines = true,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      return;
    }

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      globalThis.window.setTimeout(() => setCopied(false), 1800);
    });
  }, [code]);

  const lines = code.split('\n');

  while (lines.length > 0 && lines[lines.length - 1].trim() === '') {
    lines.pop();
  }

  const lineOccurrences = new Map<string, number>();

  return (
    <Wrap>
      <Header>
        <Dots>
          <Dot style={{ background: '#ff5f57' }} />
          <Dot style={{ background: '#febc2e' }} />
          <Dot style={{ background: '#28c840' }} />
        </Dots>
        {filename ? <Filename>{filename}</Filename> : <Filename>Example</Filename>}
        <LangBadge>{lang}</LangBadge>
        <CopyButton
          copied={copied}
          onClick={handleCopy}
          type="button"
        >
          {copied ? 'Copied' : 'Copy'}
        </CopyButton>
      </Header>

      <Pre style={maxHeight ? { maxHeight } : undefined}>
        <table>
          <tbody>
            {lines.map((line, index) => {
              const occurrence = lineOccurrences.get(line) ?? 0;
              lineOccurrences.set(line, occurrence + 1);
              const lineKey = `${occurrence}:${line}`;

              return (
                <tr key={lineKey}>
                  {showLines ? <LineNumber>{index + 1}</LineNumber> : null}
                  <LineCode>{renderLine(line, lang)}</LineCode>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Pre>
    </Wrap>
  );
};

const Wrap = styled.div`
  margin: 22px 0;
  overflow: hidden;
  border: 1px solid rgba(0, 229, 200, 0.15);
  border-radius: 12px;
  background: #0d1117;
  box-shadow:
    0 4px 32px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;

  @media (max-width: 640px) {
    margin: 18px 0;
    border-radius: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #161b22;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    grid-template-areas:
      'dots filename filename'
      'lang lang copy';
    gap: 8px 10px;
    padding: 10px 12px;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 6px;

  @media (max-width: 640px) {
    grid-area: dots;
  }
`;

const Dot = styled.div`
  width: 11px;
  height: 11px;
  border-radius: 999px;
  opacity: 0.82;
`;

const Filename = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #8b949e;
  font-family:
    'DM Mono',
    'SFMono-Regular',
    Consolas,
    'Liberation Mono',
    monospace;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 640px) {
    grid-area: filename;
  }
`;

const LangBadge = styled.span`
  padding: 2px 8px;
  border: 1px solid rgba(0, 229, 200, 0.2);
  border-radius: 4px;
  background: rgba(0, 229, 200, 0.1);
  color: #00e5c8;
  font-family:
    'DM Mono',
    'SFMono-Regular',
    Consolas,
    'Liberation Mono',
    monospace;
  font-size: 10px;
  font-weight: 600;
  text-transform: lowercase;
  width: fit-content;

  @media (max-width: 640px) {
    grid-area: lang;
  }
`;

const CopyButton = styled.button<{ copied: boolean }>`
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  background: transparent;
  color: ${({ copied }) => (copied ? '#22c55e' : '#8b949e')};
  font-family:
    'DM Mono',
    'SFMono-Regular',
    Consolas,
    'Liberation Mono',
    monospace;
  font-size: 11px;
  cursor: pointer;
  transition:
    border-color 160ms ease,
    color 160ms ease;
  white-space: nowrap;

  @media (max-width: 640px) {
    grid-area: copy;
    justify-self: end;
    padding: 4px 8px;
  }

  &:hover {
    border-color: rgba(0, 229, 200, 0.4);
    color: #00e5c8;
  }
`;

const Pre = styled.div`
  overflow: auto;
  padding: 16px 0;
  background: #0d1117;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;

  table {
    width: 100%;
    min-width: max-content;
    border-collapse: collapse;
  }

  tr:hover {
    background: rgba(255, 255, 255, 0.025);
  }

  @media (max-width: 640px) {
    padding: 12px 0;
  }
`;

const LineNumber = styled.td`
  min-width: 48px;
  padding: 0 16px;
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  color: #3d444d;
  font-family:
    'DM Mono',
    'SFMono-Regular',
    Consolas,
    'Liberation Mono',
    monospace;
  font-size: 13px;
  line-height: 1.7;
  text-align: right;
  user-select: none;
  vertical-align: top;

  @media (max-width: 640px) {
    min-width: 36px;
    padding: 0 10px;
    font-size: 12px;
  }
`;

const LineCode = styled.td`
  padding: 0 24px;
  color: #a6accd;
  font-family:
    'DM Mono',
    'SFMono-Regular',
    Consolas,
    'Liberation Mono',
    monospace;
  font-size: 13.5px;
  line-height: 1.7;
  white-space: pre;
  vertical-align: top;

  @media (max-width: 640px) {
    padding: 0 14px;
    font-size: 12.5px;
    line-height: 1.6;
  }
`;
