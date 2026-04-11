'use client';

import { useState } from 'react';

import type { CodeSnippet } from '@/types';

import { DocSnippetRenderer } from './DocSnippetRenderer';

type CodeTabsProps = {
  interactive?: boolean;
  snippets: CodeSnippet[];
};

export const CodeTabs = ({ interactive = false, snippets }: CodeTabsProps) => {
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

      <DocSnippetRenderer
        interactive={interactive}
        snippet={current}
      />
    </div>
  );
};
