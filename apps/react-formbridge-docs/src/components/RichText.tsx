'use client';

import React from 'react';

import type { CodeSnippet, DocSection } from '@/types';

import { CodeTabs } from './CodeTabs';
import { DocSnippetRenderer } from './DocSnippetRenderer';

type RichTextProps = {
  interactiveCode?: boolean;
  section: DocSection;
};

type RichTextBlock =
  | { type: 'code'; lang?: string; filename?: string; code: string }
  | { type: 'text'; lines: string[] };

type TextSegment =
  | { type: 'bullet'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'paragraph'; lines: string[] };

function isMarkdownTableRow(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2;
}

function isMarkdownTableDivider(line: string): boolean {
  if (!isMarkdownTableRow(line)) {
    return false;
  }

  return parseMarkdownTableCells(line).every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseMarkdownTableCells(line: string): string[] {
  const trimmed = line.trim().slice(1, -1);
  const cells: string[] = [];
  let current = '';

  for (let index = 0; index < trimmed.length; index += 1) {
    const char = trimmed[index];
    const nextChar = trimmed[index + 1];

    if (char === '\\' && nextChar === '|') {
      current += '|';
      index += 1;
      continue;
    }

    if (char === '|') {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());

  return cells.map((cell) => cell.replaceAll('&#124;', '|').replaceAll('&vert;', '|'));
}

function renderInlineText(text: string): React.ReactNode[] {
  return text
    .split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href);

        return (
          <a
            className="inline-link"
            href={href}
            key={`${part}-${index.toString()}`}
            rel={external ? 'noreferrer' : undefined}
            target={external ? '_blank' : undefined}
          >
            {label}
          </a>
        );
      }

      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`${part}-${index.toString()}`}>{part.slice(2, -2)}</strong>;
      }

      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            className="inline-code"
            key={`${part}-${index.toString()}`}
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      return <React.Fragment key={`${part}-${index.toString()}`}>{part}</React.Fragment>;
    });
}

function parseRichTextBlocks(content: string): RichTextBlock[] {
  const lines = content.trim().split('\n');
  const blocks: RichTextBlock[] = [];
  let textBuffer: string[] = [];
  let codeBuffer: string[] = [];
  let codeLang: string | undefined;
  let codeFilename: string | undefined;
  let inCodeBlock = false;

  const flushText = () => {
    const normalized = textBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) {
      blocks.push({ type: 'text', lines: normalized });
    }
    textBuffer = [];
  };

  const flushCode = () => {
    blocks.push({
      type: 'code',
      lang: codeLang,
      filename: codeFilename,
      code: codeBuffer.join('\n').trimEnd(),
    });
    codeBuffer = [];
    codeLang = undefined;
    codeFilename = undefined;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushText();
        const info = trimmed.slice(3).trim();
        if (info) {
          const [lang, ...rest] = info.split(/\s+/);
          codeLang = lang || undefined;
          codeFilename = rest.length > 0 ? rest.join(' ') : undefined;
        } else {
          codeLang = undefined;
          codeFilename = undefined;
        }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (trimmed === '') {
      flushText();
      continue;
    }

    textBuffer.push(line);
  }

  if (inCodeBlock) {
    flushCode();
  } else {
    flushText();
  }

  return blocks;
}

function splitTextSegments(lines: string[]): TextSegment[] {
  const segments: TextSegment[] = [];
  let paragraphBuffer: string[] = [];
  let bulletBuffer: string[] = [];
  let orderedBuffer: string[] = [];

  const flushParagraph = () => {
    const normalized = paragraphBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) {
      segments.push({ type: 'paragraph', lines: normalized });
    }
    paragraphBuffer = [];
  };

  const flushBullets = () => {
    const normalized = bulletBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) {
      segments.push({ type: 'bullet', items: normalized });
    }
    bulletBuffer = [];
  };

  const flushOrdered = () => {
    const normalized = orderedBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) {
      segments.push({ type: 'ordered', items: normalized });
    }
    orderedBuffer = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    const trimmed = line.trim();

    if (
      isMarkdownTableRow(line) &&
      index + 1 < lines.length &&
      isMarkdownTableDivider(lines[index + 1] ?? '')
    ) {
      flushParagraph();
      flushBullets();
      flushOrdered();

      const headers = parseMarkdownTableCells(line);
      const rows: string[][] = [];

      index += 2;

      while (index < lines.length && isMarkdownTableRow(lines[index] ?? '')) {
        const currentLine = lines[index] ?? '';

        if (!isMarkdownTableDivider(currentLine)) {
          rows.push(parseMarkdownTableCells(currentLine));
        }

        index += 1;
      }

      segments.push({ type: 'table', headers, rows });
      index -= 1;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      flushParagraph();
      flushOrdered();
      bulletBuffer.push(trimmed.slice(2));
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      flushBullets();
      orderedBuffer.push(trimmed.replace(/^\d+\.\s/, ''));
      continue;
    }

    flushBullets();
    flushOrdered();
    paragraphBuffer.push(trimmed);
  }

  flushParagraph();
  flushBullets();
  flushOrdered();

  return segments;
}

function parseRecipeItem(text: string): { label: string; example: string } | null {
  const [label, ...rest] = text.split('→');

  if (!label || rest.length === 0) {
    return null;
  }

  const example = rest.join('→').trim();

  if (!(example.startsWith('`') && example.endsWith('`'))) {
    return null;
  }

  return {
    label: label.trim(),
    example: example.slice(1, -1),
  };
}

const SectionCode = ({
  code,
  codeTabs,
  interactive = false,
}: {
  code?: CodeSnippet;
  codeTabs?: CodeSnippet[];
  interactive?: boolean;
}) => {
  if (codeTabs?.length) {
    return (
      <CodeTabs
        interactive={interactive}
        snippets={codeTabs}
      />
    );
  }

  if (!code) {
    return null;
  }

  return (
    <DocSnippetRenderer
      interactive={interactive}
      snippet={code}
    />
  );
};

function normalizeInlineSnippetLang(lang?: string): CodeSnippet['lang'] {
  if (lang === 'bash' || lang === 'json' || lang === 'ts') {
    return lang;
  }

  return 'tsx';
}

function renderRichText(content: string, interactiveCode = false): React.ReactNode {
  return parseRichTextBlocks(content).map((block, index) => {
    if (block.type === 'code') {
      const lang = normalizeInlineSnippetLang(block.lang);
      const filename = block.filename ?? `InlineExample-${index.toString()}.${lang}`;

      return (
        <div
          className="doc-content__block"
          key={`code-${index.toString()}`}
        >
          <DocSnippetRenderer
            interactive={interactiveCode}
            snippet={{
              code: block.code,
              filename,
              lang,
            }}
          />
        </div>
      );
    }

    return splitTextSegments(block.lines).map((segment, segmentIndex) => {
      if (segment.type === 'bullet') {
        const recipes = segment.items.map(parseRecipeItem);
        const recipeItems = recipes.filter(
          (recipe): recipe is { label: string; example: string } => Boolean(recipe),
        );

        if (recipeItems.length === segment.items.length) {
          return (
            <div
              className="recipe-grid"
              key={`recipe-${index.toString()}-${segmentIndex.toString()}`}
            >
              {recipeItems.map((recipe, recipeIndex) => (
                <div
                  className="recipe-card"
                  key={`recipe-item-${recipeIndex.toString()}`}
                >
                  <div className="recipe-card__label">
                    {renderInlineText(recipe.label)}
                  </div>
                  <pre className="recipe-card__example">{recipe.example}</pre>
                </div>
              ))}
            </div>
          );
        }

        return (
          <ul
            className="doc-list"
            key={`list-${index.toString()}-${segmentIndex.toString()}`}
          >
            {segment.items.map((item, itemIndex) => (
              <li key={`item-${itemIndex.toString()}`}>{renderInlineText(item)}</li>
            ))}
          </ul>
        );
      }

      if (segment.type === 'ordered') {
        return (
          <ol
            className="doc-list doc-list--ordered"
            key={`ordered-${index.toString()}-${segmentIndex.toString()}`}
          >
            {segment.items.map((item, itemIndex) => (
              <li key={`item-${itemIndex.toString()}`}>{renderInlineText(item)}</li>
            ))}
          </ol>
        );
      }

      if (segment.type === 'table') {
        const columnCount = Math.max(
          segment.headers.length,
          ...segment.rows.map((row) => row.length),
        );
        const headers = Array.from({ length: columnCount }, (_value, headerIndex) => {
          return segment.headers[headerIndex] ?? `Column ${headerIndex + 1}`;
        });

        return (
          <div
            className="doc-rich-table-shell"
            key={`table-${index.toString()}-${segmentIndex.toString()}`}
          >
            <table className="doc-rich-table">
              <thead>
                <tr>
                  {headers.map((header, headerIndex) => (
                    <th key={`header-${headerIndex.toString()}`}>
                      {renderInlineText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {segment.rows.map((row, rowIndex) => (
                  <tr key={`row-${rowIndex.toString()}`}>
                    {headers.map((header, cellIndex) => (
                      <td
                        data-label={header.replaceAll('`', '')}
                        key={`cell-${rowIndex.toString()}-${cellIndex.toString()}`}
                      >
                        {renderInlineText(row[cellIndex] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return (
        <p key={`paragraph-${index.toString()}-${segmentIndex.toString()}`}>
          {segment.lines.map((line, lineIndex) => (
            <React.Fragment key={`line-${lineIndex.toString()}`}>
              {lineIndex > 0 ? <br /> : null}
              {renderInlineText(line)}
            </React.Fragment>
          ))}
        </p>
      );
    });
  });
}

export const RichText = ({ interactiveCode = false, section }: RichTextProps) => {
  return (
    <div className="doc-content">
      {section.content ? (
        <div className="doc-content__body">
          {renderRichText(section.content, interactiveCode)}
        </div>
      ) : null}
      <SectionCode
        code={section.code}
        codeTabs={section.codeTabs}
        interactive={interactiveCode}
      />

      {section.subsections?.map((subsection) => (
        <section
          className="doc-subsection"
          id={subsection.id}
          key={subsection.id}
        >
          <h2 className="doc-subsection__title">{subsection.title}</h2>
          {subsection.content ? (
            <div className="doc-content__body">
              {renderRichText(subsection.content, interactiveCode)}
            </div>
          ) : null}
          <SectionCode
            code={subsection.code}
            codeTabs={subsection.codeTabs}
            interactive={interactiveCode}
          />
        </section>
      ))}
    </div>
  );
};
