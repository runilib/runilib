'use client';

import type { ComponentProps } from 'react';

import { libraryInfo } from '@/data/site';
import { getDocsLandingHref } from '@/lib/docs';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled, { css, useTheme } from 'styled-components';
import { DocsSearch } from './DocsSearch';
import { ThemeToggle } from './ThemeToggle';

const LOGO_WORDMARK_RATIO = 1201.5 / 292.5;
// Drive the wordmark size from height. Width follows the SVG ratio automatically.
const HEADER_LOGO_HEIGHT = 58;
const HEADER_LOGO_HEIGHT_MOBILE = 32;
const HEADER_LOGO_WIDTH = Math.round(HEADER_LOGO_HEIGHT * LOGO_WORDMARK_RATIO);
const HEADER_LOGO_WIDTH_MOBILE = Math.round(
  HEADER_LOGO_HEIGHT_MOBILE * LOGO_WORDMARK_RATIO,
);

export function SiteHeader() {
  const docsHref = getDocsLandingHref();
  const pathname = usePathname();
  const theme = useTheme();
  const feedbackHref =
    pathname && pathname !== '/feedback'
      ? `/feedback?from=${encodeURIComponent(pathname)}`
      : '/feedback';
  const logoSrc =
    theme.mode === 'dark' ? '/brand/logo-light.svg' : '/brand/logo-black.svg';

  return (
    <Header>
      <HeaderInner className="shell">
        <Brand href="/">
          <LogoBadge>
            <LogoImage
              src={logoSrc}
              alt="react-formbridge"
              fill
              priority
              sizes={`(max-width: 520px) ${HEADER_LOGO_WIDTH_MOBILE}px, ${HEADER_LOGO_WIDTH}px`}
              unoptimized
            />
          </LogoBadge>
        </Brand>

        <Nav aria-label="Primary">
          <NavLink href={docsHref}>Docs</NavLink>
          <NavLink href={feedbackHref}>Feedback</NavLink>
        </Nav>

        <HeaderActions>
          <DocsSearch />
          <ActionIconLink
            href={libraryInfo.npmUrl}
            rel="noreferrer"
            target="_blank"
            aria-label="Open the npm package"
            title="npm package"
          >
            <NpmIcon aria-hidden="true" />
          </ActionIconLink>
          <ActionIconLink
            href={libraryInfo.discordUrl}
            rel="noreferrer"
            target="_blank"
            aria-label="Join the Discord server"
            title="Discord"
          >
            <DiscordIcon aria-hidden="true" />
          </ActionIconLink>
          <ActionIconLink
            href={libraryInfo.githubUrl}
            rel="noreferrer"
            target="_blank"
            aria-label="Open the GitHub repository"
            title="GitHub repository"
          >
            <GitHubIcon aria-hidden="true" />
          </ActionIconLink>
          <ThemeToggle />
        </HeaderActions>
      </HeaderInner>
    </Header>
  );
}

const NpmIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>npm</title>
      <path d="M3.5 7.5h17v9h-5.1V11h-2.8v5.5H3.5z" />
      <path d="M8.7 11v5.5" />
    </svg>
  );
};

const DiscordIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <title>Discord</title>
      <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.36-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.09.22.17.33.26.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.02.03.05.03.07.02 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02ZM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12Zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12Z" />
    </svg>
  );
};

const GitHubIcon = (props: ComponentProps<'svg'>) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <title>GitHub</title>
      <path d="M12 2.75a9.25 9.25 0 0 0-2.92 18.03c.46.08.63-.2.63-.45v-1.58c-2.56.56-3.1-1.09-3.1-1.09-.41-1.03-1.03-1.3-1.03-1.3-.84-.57.06-.56.06-.56.93.07 1.42.95 1.42.95.82 1.42 2.2 1 2.74.77.08-.61.32-1.03.58-1.26-2.04-.23-4.18-1.02-4.18-4.55 0-1 .36-1.82.95-2.46-.1-.23-.41-1.17.09-2.44 0 0 .77-.25 2.53.94a8.7 8.7 0 0 1 4.6 0c1.76-1.19 2.53-.94 2.53-.94.5 1.27.19 2.21.1 2.44.59.64.94 1.46.94 2.46 0 3.54-2.14 4.32-4.19 4.55.33.28.62.84.62 1.7v2.52c0 .25.17.53.64.45A9.25 9.25 0 0 0 12 2.75Z" />
    </svg>
  );
};

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  backdrop-filter: blur(18px);
  background: ${({ theme }) => theme.headerBg};
`;

const HeaderInner = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'brand nav actions';
  align-items: center;
  gap: 16px 20px;
  min-height: 76px;
  padding: 10px 0;

  @media (max-width: 880px) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      'brand actions'
      'nav nav';
    align-items: center;
    gap: 10px 12px;
    min-height: auto;
    padding: 10px 0 12px;
  }

  @media (max-width: 520px) {
    gap: 8px 10px;
    padding: 8px 0 10px;
  }
`;

const Brand = styled(Link)`
  grid-area: brand;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: ${HEADER_LOGO_HEIGHT}px;
  min-width: 0;
  width: fit-content;

  @media (max-width: 520px) {
    gap: 8px;
    min-height: ${HEADER_LOGO_HEIGHT_MOBILE}px;
  }
`;

const LogoBadge = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  width: ${HEADER_LOGO_WIDTH}px;
  height: ${HEADER_LOGO_HEIGHT}px;
  flex: 0 0 ${HEADER_LOGO_WIDTH}px;
  line-height: 0;
  overflow: hidden;

  @media (max-width: 520px) {
    width: ${HEADER_LOGO_WIDTH_MOBILE}px;
    height: ${HEADER_LOGO_HEIGHT_MOBILE}px;
    flex-basis: ${HEADER_LOGO_WIDTH_MOBILE}px;
  }
`;

const LogoImage = styled(Image)`
  object-fit: contain;
  object-position: left center;
`;

const Nav = styled.nav`
  grid-area: nav;
  display: inline-flex;
  justify-self: end;
  justify-content: flex-end;
  gap: 18px;
  flex-wrap: wrap;

  @media (max-width: 880px) {
    justify-self: stretch;
    justify-content: flex-start;
    gap: 14px;
    overflow-x: auto;
    flex-wrap: nowrap;
    width: 100%;
    padding: 4px 0 2px;
    border-top: 1px solid ${({ theme }) => theme.border};
    scrollbar-width: none;
  }

  @media (max-width: 520px) {
    gap: 12px;
    padding-top: 6px;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const navItemStyles = css`
  color: ${({ theme }) => theme.textSoft};
  font-size: 14px;
  font-weight: 600;
  transition: color 160ms ease;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const NavLink = styled(Link)`
  ${navItemStyles}
`;

const actionIconStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.textSoft};
  transition:
    border-color 160ms ease,
    color 160ms ease,
    background 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
  }

  svg {
    width: 18px;
    height: 18px;
    display: block;
  }

  @media (max-width: 520px) {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
    border-radius: 7px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ActionIconLink = styled.a`
  ${actionIconStyles}
`;

const HeaderActions = styled.div`
  grid-area: actions;
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;
  min-width: fit-content;
`;
