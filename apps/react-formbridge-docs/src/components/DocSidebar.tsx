'use client';

import { type MouseEvent as ReactMouseEvent, useEffect, useRef } from 'react';

import { getGroupedEntries } from '@/lib/docs';

import Link from 'next/link';

type DocSidebarProps = {
  currentSlug?: string;
};

const GROUP_LABELS: Record<string, string> = {
  'Getting started': 'Getting started',
  Tutorials: 'Tutorials',
  'Core API': 'Core API',
  'Available Field builders': 'Field builders',
  Advanced: 'Advanced',
};

const ENTRY_LABEL_OVERRIDES: Record<string, string> = {
  'fb-overview': 'Introduction',
};

type SidebarIconVariant = 'api' | 'component' | 'core' | 'advanced';

const SIDEBAR_SCROLL_PADDING = 10;

const getSidebarIconVariant = (group: string): SidebarIconVariant => {
  if (group === 'Available Field builders') {
    return 'component';
  }

  if (group === 'Advanced') {
    return 'advanced';
  }

  if (group === 'Core API') {
    return 'api';
  }

  return 'core';
};

const isLinkVisibleWithinSidebar = (
  navElement: HTMLElement,
  activeLink: HTMLElement,
  padding = SIDEBAR_SCROLL_PADDING,
) => {
  if (navElement.clientHeight === 0 || navElement.offsetParent === null) {
    return false;
  }

  const navRect = navElement.getBoundingClientRect();
  const activeRect = activeLink.getBoundingClientRect();

  return (
    activeRect.top >= navRect.top + padding &&
    activeRect.bottom <= navRect.bottom - padding
  );
};

export const DocSidebar = ({ currentSlug }: DocSidebarProps) => {
  const groups = getGroupedEntries();
  const navRef = useRef<HTMLElement | null>(null);
  const pendingNavigationRef = useRef<{ preserveScroll: boolean; slug: string } | null>(
    null,
  );

  const rememberSidebarClick = (event: ReactMouseEvent<HTMLElement>) => {
    const navElement = navRef.current;

    if (!navElement) {
      return;
    }

    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const clickedLink = target.closest<HTMLElement>('[data-doc-slug]');
    const slug = clickedLink?.dataset.docSlug;

    if (!clickedLink || !slug) {
      return;
    }

    pendingNavigationRef.current = {
      preserveScroll: isLinkVisibleWithinSidebar(navElement, clickedLink),
      slug,
    };
  };

  useEffect(() => {
    const navElement = navRef.current;

    if (!navElement) {
      return;
    }

    if (navElement.clientHeight === 0 || navElement.offsetParent === null) {
      return;
    }

    const activeLink =
      (currentSlug
        ? navElement.querySelector<HTMLElement>(`[data-doc-slug="${currentSlug}"]`)
        : null) ?? navElement.querySelector<HTMLElement>('[aria-current="page"]');

    if (!activeLink) {
      return;
    }

    if (
      currentSlug &&
      pendingNavigationRef.current?.slug === currentSlug &&
      pendingNavigationRef.current.preserveScroll
    ) {
      pendingNavigationRef.current = null;
      return;
    }

    pendingNavigationRef.current = null;

    const frame = requestAnimationFrame(() => {
      const padding = SIDEBAR_SCROLL_PADDING;
      const navRect = navElement.getBoundingClientRect();
      const activeRect = activeLink.getBoundingClientRect();
      const currentScrollTop = navElement.scrollTop;
      const activeTop = activeRect.top - navRect.top + currentScrollTop;
      const activeBottom = activeRect.bottom - navRect.top + currentScrollTop;
      const visibleTop = currentScrollTop + padding;
      const visibleBottom = currentScrollTop + navElement.clientHeight - padding;

      if (activeTop < visibleTop) {
        navElement.scrollTo({
          top: Math.max(activeTop - padding, 0),
        });
        return;
      }

      if (activeBottom > visibleBottom) {
        navElement.scrollTo({
          top: Math.max(activeBottom - navElement.clientHeight + padding, 0),
        });
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [currentSlug]);

  return (
    <nav
      aria-label="Documentation"
      className="doc-sidebar"
      onClickCapture={rememberSidebarClick}
      ref={navRef}
    >
      {groups.map((group) => (
        <div
          className="doc-sidebar__group"
          key={group.group}
        >
          <p className="doc-sidebar__label">{GROUP_LABELS[group.group] ?? group.group}</p>
          {group.entries.map((entry) => (
            <Link
              aria-current={currentSlug === entry.slug ? 'page' : undefined}
              className={
                currentSlug === entry.slug
                  ? 'doc-sidebar__link is-active'
                  : 'doc-sidebar__link'
              }
              data-doc-slug={entry.slug}
              href={entry.href}
              key={entry.id}
            >
              <span
                className={`doc-sidebar__icon doc-sidebar__icon--${getSidebarIconVariant(group.group)}`}
                aria-hidden="true"
              />
              <span className="doc-sidebar__text">
                {ENTRY_LABEL_OVERRIDES[entry.id] ?? entry.label}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
};
