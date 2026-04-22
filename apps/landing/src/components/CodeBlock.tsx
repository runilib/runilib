import type React from 'react';
import { useCallback, useState } from 'react';

import styled from 'styled-components';

// ── VS Code One Dark color palette ────────────────────────────
const C = {
  keyword: '#c792ea', // purple    - import, export, const, return, if...
  string: '#c3e88d', // green     - "string", 'string', `template`
  template: '#c3e88d', // green
  comment: '#546e7a', // gray-blue - // and /* */
  funcName: '#82aaff', // blue      - function names, hooks
  typeName: '#ffcb6b', // yellow    - Type, Interface, class names
  attrName: '#89ddff', // cyan      - JSX props/attrs
  tagName: '#f07178', // coral     - <Component>, html tags
  number: '#f78c6c', // orange    - 42, 3.14, 0xFF
  boolean: '#ff9cac', // pink      - true, false, null, undefined
  operator: '#89ddff', // cyan      - =>, =, ?, :, +
  punct: '#89ddff', // cyan      - {}, (), []
  plain: '#a6accd', // light     - default text
  dimmed: '#4a5568', // muted
  regex: '#ff5370', // red       - /regex/
  decorator: '#ffcb6b', // yellow    - @decorator
} as const;

// ── Token types ───────────────────────────────────────────────
type TokenType = keyof typeof C;
interface Token {
  type: TokenType;
  value: string;
}

// ── Keywords ──────────────────────────────────────────────────
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

// ── Tokenizer ─────────────────────────────────────────────────
function tokenize(code: string, _lang: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const val = end === -1 ? code.slice(i) : code.slice(i, end);
      tokens.push({ type: 'comment', value: val });
      i += val.length;
      continue;
    }

    // Multi-line comment
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const val = end === -1 ? code.slice(i) : code.slice(i, end + 2);
      tokens.push({ type: 'comment', value: val });
      i += val.length;
      continue;
    }

    // Template literal
    if (code[i] === '`') {
      let val = '`';
      i++;
      while (i < code.length && code[i] !== '`') {
        if (code[i] === '\\') {
          val += code[i] + (code[i + 1] || '');
          i += 2;
          continue;
        }
        val += code[i++];
      }
      val += '`';
      i++;
      tokens.push({ type: 'template', value: val });
      continue;
    }

    // String (single or double quote)
    if (code[i] === '"' || code[i] === "'") {
      const q = code[i];
      let val = q;
      i++;
      while (i < code.length && code[i] !== q && code[i] !== '\n') {
        if (code[i] === '\\') {
          val += code[i] + (code[i + 1] || '');
          i += 2;
          continue;
        }
        val += code[i++];
      }
      val += q;
      i++;
      tokens.push({ type: 'string', value: val });
      continue;
    }

    // JSX string attr (already handled above)

    // Number
    if (/\d/.test(code[i]) || (code[i] === '.' && /\d/.test(code[i + 1] || ''))) {
      let val = '';
      while (i < code.length && /[\d._xXa-fA-F]/.test(code[i])) val += code[i++];
      tokens.push({ type: 'number', value: val });
      continue;
    }

    // Identifier or keyword
    if (/[a-zA-Z_$]/.test(code[i])) {
      let val = '';
      while (i < code.length && /[\w$]/.test(code[i])) val += code[i++];

      // Lookahead for function call / JSX tag
      const nextNonSpace = code.slice(i).match(/^[ \t]*(.)/)?.[1];
      const prevChar =
        tokens.length > 0 ? tokens[tokens.length - 1].value.trimEnd().slice(-1) : '';

      if (KEYWORDS.has(val)) {
        tokens.push({ type: 'keyword', value: val });
      } else if (BOOLEANS.has(val)) {
        tokens.push({ type: 'boolean', value: val });
      } else if (
        BUILTINS.has(val) ||
        (val[0] === val[0].toUpperCase() && prevChar !== '.')
      ) {
        // PascalCase or builtin
        if (nextNonSpace === '(') {
          tokens.push({ type: 'funcName', value: val });
        } else if (/^[A-Z]/.test(val)) {
          tokens.push({ type: 'typeName', value: val });
        } else {
          tokens.push({ type: 'funcName', value: val });
        }
      } else if (nextNonSpace === '(') {
        tokens.push({ type: 'funcName', value: val });
      } else if (
        prevChar === '<' ||
        (prevChar === '/' && tokens[tokens.length - 2]?.value === '<')
      ) {
        tokens.push({ type: 'tagName', value: val });
      } else {
        tokens.push({ type: 'plain', value: val });
      }
      continue;
    }

    // JSX/HTML tag open  <Tag   /  </Tag
    if (code[i] === '<' && /[A-Za-z/!]/.test(code[i + 1] || '')) {
      tokens.push({ type: 'punct', value: code[i] });
      i++;
      continue;
    }

    // Operator / punctuation
    if ('{}()[].,:;!?@#'.includes(code[i])) {
      tokens.push({ type: 'punct', value: code[i] });
      i++;
      continue;
    }
    if ('=><>|&+-*/%^~'.includes(code[i])) {
      let val = code[i++];
      if ((val === '=' || val === '!' || val === '<' || val === '>') && code[i] === '=')
        val += code[i++];
      if (val === '=' && code[i] === '>') val += code[i++];
      tokens.push({ type: 'operator', value: val });
      continue;
    }

    // Whitespace / newlines
    if (code[i] === '\n') {
      tokens.push({ type: 'plain', value: '\n' });
      i++;
      continue;
    }
    if (/\s/.test(code[i])) {
      let val = '';
      while (i < code.length && code[i] !== '\n' && /\s/.test(code[i])) val += code[i++];
      tokens.push({ type: 'plain', value: val });
      continue;
    }

    // Fallback
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }

  return tokens;
}

// ── Render highlighted line ───────────────────────────────────
function renderLine(line: string, lang: string): React.ReactNode {
  if (lang === 'bash') {
    const [cmd, ...rest] = line.split(' ');
    if (cmd === '#') return <span style={{ color: C.comment }}>{line}</span>;
    const isCmd = [
      'npm',
      'yarn',
      'pnpm',
      'npx',
      'git',
      'cd',
      'echo',
      'export',
      'mkdir',
    ].includes(cmd);
    if (isCmd)
      return (
        <>
          <span style={{ color: C.funcName }}>{cmd}</span>
          {rest.length > 0 && <span style={{ color: C.plain }}> {rest.join(' ')}</span>}
        </>
      );
    return <span style={{ color: C.plain }}>{line}</span>;
  }

  const tokens = tokenize(line, lang);
  let cursor = 0;

  return tokens.map((tok) => {
    const key = `${tok.type}:${cursor}:${tok.value}`;
    cursor += tok.value.length;

    return (
      <span
        key={key}
        style={{ color: C[tok.type] }}
      >
        {tok.value}
      </span>
    );
  });
}

// ── Props ─────────────────────────────────────────────────────
interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
  showLines?: boolean;
  maxHeight?: string;
}

export function CodeBlock({
  code,
  lang = 'tsx',
  filename,
  showLines = true,
  maxHeight,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const lines = code.split('\n');
  // trim trailing empty line
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  const lineOccurrences = new Map<string, number>();

  return (
    <Wrap>
      <Header>
        <Dots>
          <Dot style={{ background: '#ff5f57' }} />
          <Dot style={{ background: '#febc2e' }} />
          <Dot style={{ background: '#28c840' }} />
        </Dots>
        {filename && <Filename>{filename}</Filename>}
        <LangBadge>{lang}</LangBadge>
        <CopyBtn
          onClick={handleCopy}
          copied={copied}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </CopyBtn>
      </Header>
      <Pre style={maxHeight ? { maxHeight } : undefined}>
        <table>
          <tbody>
            {lines.map((line, idx) => {
              const occurrence = lineOccurrences.get(line) ?? 0;
              lineOccurrences.set(line, occurrence + 1);
              const lineKey = `${occurrence}:${line}`;

              return (
                <tr key={lineKey}>
                  {showLines && <LineNum>{idx + 1}</LineNum>}
                  <LineCode>
                    {renderLine(line, lang)}
                    {'\n'}
                  </LineCode>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Pre>
    </Wrap>
  );
}

// ── Inline code ───────────────────────────────────────────────
export const InlineCode = styled.code`
  font-family: 'DM Mono', monospace;
  font-size: 0.88em;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0,229,200,0.08);
  color: ${({ theme }) => theme.teal};
  border: 1px solid rgba(0,229,200,0.15);
`;

// ── Styled components ─────────────────────────────────────────
const Wrap = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0,229,200,0.15);
  box-shadow: 0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
  background: #0d1117;
  width: 100%;
  max-width: 100%;
  min-width: 0;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #161b22;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  min-width: 0;
  @media (max-width: 480px) {
    gap: 8px;
    padding: 10px 12px;
  }
`;
const Dots = styled.div`
  display: flex;
  gap: 6px;
`;
const Dot = styled.div`
  width: 11px; height: 11px;
  border-radius: 50%;
  opacity: 0.8;
`;
const Filename = styled.span`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  color: #8b949e;
  flex: 1;
`;
const LangBadge = styled.span`
  font-family: 'DM Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0,229,200,0.1);
  color: #00e5c8;
  border: 1px solid rgba(0,229,200,0.2);
`;
const CopyBtn = styled.button<{ copied: boolean }>`
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 5px;
  border: 1px solid rgba(255,255,255,0.1);
  background: transparent;
  color: ${({ copied }) => (copied ? '#22c55e' : '#8b949e')};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  &:hover { border-color: rgba(0,229,200,0.4); color: #00e5c8; }
`;
const Pre = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  padding: 16px 0;
  background: #0d1117;
  max-width: 100%;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  table {
    border-collapse: collapse;
    width: 100%;
    min-width: max-content;
  }
  tr:hover { background: rgba(255,255,255,0.025); }
`;
const LineNum = styled.td`
  font-family: 'DM Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 0 16px 0 16px;
  text-align: right;
  color: #3d444d;
  user-select: none;
  min-width: 48px;
  border-right: 1px solid rgba(255,255,255,0.04);
  vertical-align: top;
  @media (max-width: 600px) {
    font-size: 11.5px;
    padding: 0 10px;
    min-width: 32px;
  }
`;
const LineCode = styled.td`
  font-family: 'DM Mono', monospace;
  font-size: 13.5px;
  line-height: 1.7;
  padding: 0 24px;
  white-space: pre;
  vertical-align: top;
  color: #a6accd;
  @media (max-width: 600px) {
    font-size: 12px;
    padding: 0 14px;
  }
`;
