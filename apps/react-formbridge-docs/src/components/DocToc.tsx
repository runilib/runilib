'use client';

import { useEffect, useState } from 'react';

type TocItem = {
  id: string;
  label: string;
};

type DocTocProps = {
  items: TocItem[];
};

const SECTION_OFFSET = 140;

function getActiveSectionId(items: TocItem[]) {
  if (globalThis.window === undefined) {
    return items[0]?.id ?? null;
  }

  const hash = globalThis.window.location.hash.replace(/^#/, '');

  if (hash && items.some((item) => item.id === hash)) {
    const target = document.getElementById(hash);

    if (target) {
      const { top, bottom } = target.getBoundingClientRect();

      if (top <= SECTION_OFFSET && bottom > SECTION_OFFSET) {
        return hash;
      }
    }
  }

  let activeId = items[0]?.id ?? null;

  for (const item of items) {
    const element = document.getElementById(item.id);

    if (!element) {
      continue;
    }

    if (element.getBoundingClientRect().top - SECTION_OFFSET <= 0) {
      activeId = item.id;
      continue;
    }

    break;
  }

  return activeId;
}

export const DocToc = ({ items }: DocTocProps) => {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) {
      setActiveId(null);
      return;
    }

    let frame = 0;

    const updateActiveSection = () => {
      const nextActiveId = getActiveSectionId(items);

      setActiveId((current) => (current === nextActiveId ? current : nextActiveId));
    };

    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = globalThis.window.requestAnimationFrame(updateActiveSection);
    };

    requestUpdate();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    globalThis.window.addEventListener('hashchange', requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      globalThis.window.removeEventListener('hashchange', requestUpdate);
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="On this page"
      className="docs-toc"
    >
      <p className="docs-toc__label">On this page</p>
      <div className="docs-toc__list">
        {items.map((item) => (
          <a
            aria-current={activeId === item.id ? 'location' : undefined}
            className={activeId === item.id ? 'is-active' : undefined}
            href={`#${item.id}`}
            key={item.id}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
};
