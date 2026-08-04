'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { getAllDocEntries, getFeaturedEntries } from '@/lib/docs';
import type { DocEntry, DocSection } from '@/types';

import { usePathname, useRouter } from 'next/navigation';
import styled from 'styled-components';
import { field, useFormBridge } from '../demoFormBridge';

interface SearchIndexItem {
  entry: DocEntry;
  text: string;
  summary: string;
  subsectionTitles: string[];
}

interface SearchResult {
  item: SearchIndexItem;
  score: number;
  matchedSections: string[];
}

const SEARCH_RESULTS_LIMIT = 8;
const SEARCH_SCHEMA = {
  query: field
    .text('Search docs')
    .placeholder('Search docs, hooks, builders, adapters...'),
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripMarkdown(value: string) {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function flattenSection(section: DocSection): { text: string; titles: string[] } {
  const subsectionContent = (section.subsections ?? []).map((subsection) =>
    flattenSection(subsection),
  );

  const codeBlocks = [
    section.code?.code ?? '',
    ...(section.codeTabs?.map((snippet) => snippet.code) ?? []),
  ];

  return {
    text: [
      section.title,
      stripMarkdown(section.content),
      ...codeBlocks,
      ...subsectionContent.map((item) => item.text),
    ]
      .filter(Boolean)
      .join(' '),
    titles: [section.title, ...subsectionContent.flatMap((item) => item.titles)],
  };
}

function buildSearchIndex(entries: DocEntry[]): SearchIndexItem[] {
  return entries.map((entry) => {
    const flattenedSection = flattenSection(entry.section);

    return {
      entry,
      text: normalize(
        [
          entry.title,
          entry.label,
          entry.group,
          entry.summary,
          flattenedSection.text,
        ].join(' '),
      ),
      summary: entry.summary,
      subsectionTitles: flattenedSection.titles.filter(
        (title) => normalize(title) !== normalize(entry.title),
      ),
    };
  });
}

function scoreSearch(item: SearchIndexItem, query: string): SearchResult | null {
  const normalizedQuery = normalize(query);
  const terms = normalizedQuery.split(' ').filter(Boolean);

  if (!terms.length) {
    return {
      item,
      score: 0,
      matchedSections: item.subsectionTitles.slice(0, 2),
    };
  }

  if (!terms.every((term) => item.text.includes(term))) {
    return null;
  }

  const title = normalize(item.entry.title);
  const label = normalize(item.entry.label);
  const group = normalize(item.entry.group);
  const summary = normalize(item.summary);

  let score = 0;

  for (const term of terms) {
    if (title === term) score += 180;
    else if (title.startsWith(term)) score += 120;
    else if (title.includes(term)) score += 90;

    if (label === term) score += 140;
    else if (label.includes(term)) score += 70;

    if (group.includes(term)) score += 30;
    if (summary.includes(term)) score += 40;
  }

  if (title.includes(normalizedQuery)) score += 160;
  if (label.includes(normalizedQuery)) score += 120;
  if (summary.includes(normalizedQuery)) score += 60;

  const matchedSections = item.subsectionTitles
    .filter((sectionTitle) =>
      terms.some((term) => normalize(sectionTitle).includes(term)),
    )
    .slice(0, 2);

  return {
    item,
    score,
    matchedSections,
  };
}

export function DocsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchFieldRef = useRef<HTMLDivElement>(null);
  const lockedScrollYRef = useRef(0);
  const previousQueryValueRef = useRef('');
  const searchForm = useFormBridge(SEARCH_SCHEMA, {
    initialValues: {
      query: '',
    },
  });
  const searchFormRef = useRef(searchForm);
  searchFormRef.current = searchForm;
  const queryValue = String(searchForm.watch('query') ?? '');
  const queryController = searchForm.fieldController('query');
  const allEntries = useMemo(() => getAllDocEntries(), []);
  const featuredEntries = useMemo(() => getFeaturedEntries(), []);
  const searchIndex = useMemo(() => buildSearchIndex(allEntries), [allEntries]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  const resetSearch = useCallback(() => {
    searchFormRef.current?.resetFields({ query: '' });
    setActiveIndex(0);
  }, []);

  const results = useMemo(() => {
    if (!queryValue.trim()) {
      return featuredEntries
        .map((entry) => {
          const indexItem = searchIndex.find((item) => item.entry.id === entry.id);

          return indexItem
            ? {
                item: indexItem,
                score: 0,
                matchedSections: indexItem.subsectionTitles.slice(0, 2),
              }
            : null;
        })
        .filter((result): result is SearchResult => Boolean(result))
        .slice(0, SEARCH_RESULTS_LIMIT);
    }

    return searchIndex
      .map((item) => scoreSearch(item, queryValue))
      .filter((result): result is SearchResult => Boolean(result))
      .sort((left, right) => right.score - left.score)
      .slice(0, SEARCH_RESULTS_LIMIT);
  }, [featuredEntries, queryValue, searchIndex]);

  useEffect(() => {
    if (!pathname) return;

    setIsOpen(false);
    resetSearch();
  }, [pathname, resetSearch]);

  useEffect(() => {
    if (!isOpen) return;

    const frame = globalThis.window.requestAnimationFrame(() => {
      searchFormRef.current?.fieldController('query').focus();
      const input = searchFieldRef.current?.querySelector<HTMLInputElement>(
        'input[data-fb-slot="input"]',
      );

      input?.select();
    });

    return () => globalThis.window.cancelAnimationFrame(frame);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      previousQueryValueRef.current = queryValue;
      return;
    }

    if (previousQueryValueRef.current !== queryValue) {
      previousQueryValueRef.current = queryValue;
      setActiveIndex(0);
    }
  }, [isOpen, queryValue]);

  useEffect(() => {
    if (!isOpen) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    lockedScrollYRef.current = window.scrollY;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyPaddingRight = body.style.paddingRight;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverflow = documentElement.style.overflow;
    const previousHtmlOverscrollBehavior = documentElement.style.overscrollBehavior;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${lockedScrollYRef.current}px`;
    body.style.width = '100%';
    body.style.paddingRight =
      scrollbarWidth > 0 ? `${scrollbarWidth}px` : previousBodyPaddingRight;
    body.style.touchAction = 'none';
    documentElement.style.overflow = 'hidden';
    documentElement.style.overscrollBehavior = 'none';

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.paddingRight = previousBodyPaddingRight;
      body.style.touchAction = previousBodyTouchAction;
      documentElement.style.overflow = previousHtmlOverflow;
      documentElement.style.overscrollBehavior = previousHtmlOverscrollBehavior;
      window.scrollTo(0, lockedScrollYRef.current);
    };
  }, [isOpen]);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    resetSearch();
  }, [resetSearch]);

  const openSearch = useCallback(() => {
    setIsOpen(true);
    setActiveIndex(0);
  }, []);

  const navigateToEntry = useCallback(
    (href: string) => {
      closeSearch();
      router.push(href);
    },
    [closeSearch, router],
  );

  const handleSearchSubmit = useCallback(() => {
    const activeResult = results[activeIndex] ?? results[0];

    if (activeResult) {
      navigateToEntry(activeResult.item.entry.href);
    }
  }, [activeIndex, navigateToEntry, results]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';

      if (isShortcut) {
        event.preventDefault();

        if (isOpen) closeSearch();
        else openSearch();

        return;
      }

      if (!isOpen) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
        return;
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) =>
          Math.min(current + 1, Math.max(results.length - 1, 0)),
        );
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    }

    globalThis.window.addEventListener('keydown', onKeyDown);

    return () => globalThis.window.removeEventListener('keydown', onKeyDown);
  }, [closeSearch, isOpen, openSearch, results.length]);

  const searchLayer =
    isOpen && portalRoot
      ? createPortal(
          <SearchOverlay
            aria-hidden="true"
            onClick={(event) => {
              if (event.target === event.currentTarget) closeSearch();
            }}
          >
            <SearchDialog
              role="dialog"
              aria-modal="true"
              aria-label="Search documentation"
            >
              <SearchForm
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSearchSubmit();
                }}
              >
                <SearchField ref={searchFieldRef}>
                  <SearchGlyph aria-hidden="true" />
                  <SearchInput
                    ref={queryController.registerFocusable}
                    value={String(queryController.value ?? '')}
                    placeholder={queryController.placeholder}
                    onChange={(event) => queryController.onChange(event.target.value)}
                    onBlur={queryController.onBlur}
                    onFocus={queryController.onFocus}
                    autoComplete="off"
                    inputMode="search"
                    enterKeyHint="search"
                    spellCheck={false}
                  />
                  <SearchDismiss
                    type="button"
                    onClick={closeSearch}
                  >
                    Esc
                  </SearchDismiss>
                </SearchField>
              </SearchForm>

              <SearchBody>
                <SearchMeta>
                  {queryValue.trim()
                    ? `${results.length} result${results.length > 1 ? 's' : ''}`
                    : 'Popular docs'}
                </SearchMeta>

                {results.length ? (
                  <ResultsList>
                    {results.map((result, index) => (
                      <li key={result.item.entry.id}>
                        <ResultButton
                          type="button"
                          $active={index === activeIndex}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => navigateToEntry(result.item.entry.href)}
                        >
                          <ResultHeader>
                            <ResultTitle>{result.item.entry.label}</ResultTitle>
                            <ResultGroup>{result.item.entry.group}</ResultGroup>
                          </ResultHeader>
                          <ResultSummary>{result.item.summary}</ResultSummary>
                          {result.matchedSections.length ? (
                            <ResultMatches>
                              {result.matchedSections.map((sectionTitle) => (
                                <ResultTag
                                  key={`${result.item.entry.id}-${sectionTitle}`}
                                >
                                  {sectionTitle}
                                </ResultTag>
                              ))}
                            </ResultMatches>
                          ) : null}
                        </ResultButton>
                      </li>
                    ))}
                  </ResultsList>
                ) : (
                  <EmptyState>
                    No matching docs yet. Try a hook name, a field builder, or a feature
                    like persistence.
                  </EmptyState>
                )}
              </SearchBody>
            </SearchDialog>
          </SearchOverlay>,
          portalRoot,
        )
      : null;

  return (
    <>
      <SearchTrigger
        type="button"
        onClick={openSearch}
        aria-label="Search documentation"
      >
        <SearchGlyph aria-hidden="true" />
        <span>Search docs...</span>
        <SearchShortcut>⌘K</SearchShortcut>
      </SearchTrigger>

      {searchLayer}
    </>
  );
}

const SearchTrigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;
  font-weight: 600;
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }

  @media (max-width: 980px) {
    display: none;
  }
`;

const SearchGlyph = styled.span`
  position: relative;
  width: 14px;
  height: 14px;
  border: 1.8px solid currentColor;
  border-radius: 999px;

  &::after {
    content: '';
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 5px;
    height: 1.8px;
    border-radius: 999px;
    background: currentColor;
    transform: rotate(45deg);
    transform-origin: center;
  }
`;

const SearchShortcut = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 22px;
  padding: 0 7px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceSoft};
  color: ${({ theme }) => theme.textMuted};
  font-size: 11px;
  font-weight: 700;
`;

const SearchOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 88px 18px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  background: rgba(8, 17, 26, 0.34);
  backdrop-filter: blur(8px);

  @media (max-width: 640px) {
    padding: 72px 14px 18px;
  }
`;

const SearchDialog = styled.div`
  width: min(100%, 760px);
  max-height: calc(100dvh - 112px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  box-shadow: 0 28px 80px rgba(8, 17, 26, 0.18);

  @media (max-width: 640px) {
    max-height: calc(100dvh - 90px);
  }
`;

const SearchForm = styled.form`
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SearchField = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceSoft};
  color: ${({ theme }) => theme.textMuted};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  align-self: stretch;
  width: 100%;
  min-height: 52px;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  font-weight: 500;
  box-shadow: none;

  &::placeholder {
    color: ${({ theme }) => theme.textMuted};
  }
`;

const SearchDismiss = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  min-height: 26px;
  padding: 0 8px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  font-weight: 700;
`;

const SearchBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  padding: 12px 12px 14px;
`;

const SearchMeta = styled.p`
  margin: 0 0 10px;
  padding: 0 6px;
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ResultsList = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  cursor: pointer;
`;

const ResultButton = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.accent : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.accentSoft : theme.surface)};
  text-align: left;
  transition:
    border-color 160ms ease,
    background 160ms ease,
    transform 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    background: ${({ theme }) => theme.accentSoft};
    transform: translateY(-1px);
    cursor: pointer;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 6px;
`;

const ResultTitle = styled.span`
  color: ${({ theme }) => theme.text};
  font-size: 15px;
  font-weight: 700;
`;

const ResultGroup = styled.span`
  color: ${({ theme }) => theme.textMuted};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

const ResultSummary = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.textSoft};
  font-size: 13px;
  line-height: 1.55;
`;

const ResultMatches = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const ResultTag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: ${({ theme }) => theme.surfaceSoft};
  color: ${({ theme }) => theme.textMuted};
  font-size: 11px;
  font-weight: 700;
`;

const EmptyState = styled.p`
  margin: 0;
  padding: 22px 14px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
  line-height: 1.6;
`;
