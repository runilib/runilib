'use client';

import { useState } from 'react';

import type { CodeSnippet } from '@/types';

import Image from 'next/image';
import { CodeBlock } from './CodeBlock';

type CodeTabsProps = {
  snippets: CodeSnippet[];
};

export function CodeTabs({ snippets }: CodeTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = snippets[activeIndex] ?? snippets[0];

  if (!current) {
    return null;
  }

  return (
    <div className="code-tabs">
      <div className="code-tabs__list">
        {snippets.map((snippet, index) => (
          <button
            key={`${snippet.filename}-${index.toString()}`}
            className={
              index === activeIndex ? 'code-tabs__button is-active' : 'code-tabs__button'
            }
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            {snippet.label ?? snippet.filename}
          </button>
        ))}
      </div>

      <CodeBlock
        code={current.code}
        lang={current.lang}
        filename={current.filename}
        maxHeight={current.maxHeight}
      />

      {current.preview ? (
        <figure className="preview-panel">
          <div className="preview-panel__frame">
            {current.preview.video ? (
              <video
                className="preview-panel__media"
                src={current.preview.src}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <Image
                className="preview-panel__media"
                src={current.preview.src}
                alt={current.preview.alt}
                width={current.preview.maxWidth ?? 960}
                height={current.preview.maxHeight ?? 540}
                unoptimized
              />
            )}
          </div>
          {current.preview.caption ? (
            <figcaption className="preview-panel__caption">
              {current.preview.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  );
}
