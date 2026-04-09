'use client';

import React from 'react';

import type { CodeSnippet, DocPreview, DocSection } from '@/types';

import Image from 'next/image';
import { CodeBlock } from './CodeBlock';
import { CodeTabs } from './CodeTabs';

type RichTextProps = {
  section: DocSection;
};

type RichTextBlock =
  | { type: 'code'; lang?: string; code: string }
  | { type: 'text'; lines: string[] };

type TextSegment =
  | { type: 'bullet'; items: string[] }
  | { type: 'ordered'; items: string[] }
  | { type: 'paragraph'; lines: string[] };

function renderInlineText(text: string): React.ReactNode[] {
  return text
    .split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, index) => {
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
  let inCodeBlock = false;

  const flushText = () => {
    const normalized = textBuffer.map((line) => line.trim()).filter(Boolean);
    if (normalized.length > 0) {
      blocks.push({ type: 'text', lines: normalized });
    }
    textBuffer = [];
  };

  const flushCode = () => {
    blocks.push({ type: 'code', lang: codeLang, code: codeBuffer.join('\n').trimEnd() });
    codeBuffer = [];
    codeLang = undefined;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        flushCode();
        inCodeBlock = false;
      } else {
        flushText();
        codeLang = trimmed.slice(3).trim() || undefined;
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

  for (const line of lines) {
    const trimmed = line.trim();

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

function PreviewPanel({ preview }: { preview?: DocPreview }) {
  if (!preview) {
    return null;
  }

  return (
    <figure className="preview-panel">
      <div className="preview-panel__frame">
        {preview.video ? (
          <video
            className="preview-panel__media"
            src={preview.src}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            className="preview-panel__media"
            src={preview.src}
            alt={preview.alt}
            width={preview.maxWidth ?? 960}
            height={preview.maxHeight ?? 540}
            unoptimized
          />
        )}
      </div>
      {preview.caption ? (
        <figcaption className="preview-panel__caption">{preview.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function SectionCode({
  code,
  codeTabs,
}: {
  code?: CodeSnippet;
  codeTabs?: CodeSnippet[];
}) {
  if (codeTabs?.length) {
    return <CodeTabs snippets={codeTabs} />;
  }

  if (!code) {
    return null;
  }

  return (
    <>
      <CodeBlock
        code={code.code}
        lang={code.lang}
        filename={code.filename}
        maxHeight={code.maxHeight}
      />
      <PreviewPanel preview={code.preview} />
    </>
  );
}

function renderRichText(content: string): React.ReactNode {
  return parseRichTextBlocks(content).map((block, index) => {
    if (block.type === 'code') {
      return (
        <div
          className="doc-content__block"
          key={`code-${index.toString()}`}
        >
          <CodeBlock
            code={block.code}
            lang={block.lang ?? 'tsx'}
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

export function RichText({ section }: RichTextProps) {
  return (
    <div className="doc-content">
      {section.content ? (
        <div className="doc-content__body">{renderRichText(section.content)}</div>
      ) : null}
      <SectionCode
        code={section.code}
        codeTabs={section.codeTabs}
      />

      {section.subsections?.map((subsection) => (
        <section
          className="doc-subsection"
          id={subsection.id}
          key={subsection.id}
        >
          <h2 className="doc-subsection__title">{subsection.title}</h2>
          {subsection.content ? (
            <div className="doc-content__body">{renderRichText(subsection.content)}</div>
          ) : null}
          <SectionCode
            code={subsection.code}
            codeTabs={subsection.codeTabs}
          />
        </section>
      ))}
    </div>
  );
}
