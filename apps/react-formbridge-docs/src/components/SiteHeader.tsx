'use client';

import type { ComponentProps } from 'react';

import { libraryInfo } from '@/data/site';
import { getDocsLandingHref } from '@/lib/docs';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled, { css } from 'styled-components';
import { DocsSearch } from './DocsSearch';
import { ThemeToggle } from './ThemeToggle';

const HEADER_LOGO_SIZE = 54;
const HEADER_LOGO_SIZE_MOBILE = 30;

export function SiteHeader() {
  const docsHref = getDocsLandingHref();
  const pathname = usePathname();
  const feedbackHref =
    pathname && pathname !== '/feedback'
      ? `/feedback?from=${encodeURIComponent(pathname)}`
      : '/feedback';

  return (
    <Header>
      <HeaderInner className="shell">
        <Brand href="/">
          <LogoBadge $size={HEADER_LOGO_SIZE}>
            <LogoImage
              src="/brand/formbridge-logos/formbridge-icon-blue.svg"
              alt="react-formbridge"
              width={HEADER_LOGO_SIZE}
              height={HEADER_LOGO_SIZE}
              priority
              unoptimized
            />
          </LogoBadge>
          <BrandCopy>
            <BrandName>REACT FORMBRIDGE</BrandName>
          </BrandCopy>
          <BrandMeta>BY RUNILIB</BrandMeta>
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

function NpmIcon(props: ComponentProps<'svg'>) {
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
}

function GitHubIcon(props: ComponentProps<'svg'>) {
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
}

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
  min-height: 40px;
  min-width: 0;
  width: fit-content;

  @media (max-width: 520px) {
    gap: 8px;
  }
`;

const LogoBadge = styled.span<{ $size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $size }) => `${$size}px`};
  height: ${({ $size }) => `${$size}px`};
  flex: 0 0 ${({ $size }) => `${$size}px`};
  line-height: 0;

  @media (max-width: 520px) {
    width: ${HEADER_LOGO_SIZE_MOBILE}px;
    height: ${HEADER_LOGO_SIZE_MOBILE}px;
    flex-basis: ${HEADER_LOGO_SIZE_MOBILE}px;
  }
`;

const LogoImage = styled(Image)`
  display: block;
  width: 100%;
  height: 100%;
`;

const BrandName = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.text};
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  min-width: 0;

  @media (max-width: 520px) {
    font-size: 15px;
  }
`;

const BrandCopy = styled.span`
  display: inline-flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
  min-width: 0;

  @media (max-width: 520px) {
    gap: 2px;
  }
`;

const BrandMeta = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 7px;
  border-radius: 9px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.accentSoft};
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
  font-weight: 700;

  @media (max-width: 520px) {
    min-height: 24px;
    padding: 0 6px;
    font-size: 11px;
  }
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
    padding: 2px 0 1px;
    scrollbar-width: none;
  }

  @media (max-width: 520px) {
    gap: 12px;
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
`;

const ActionIconLink = styled.a`
  ${actionIconStyles}
`;

const HeaderActions = styled.div`
  grid-area: actions;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  align-items: center;

  @media (max-width: 880px) {
    justify-content: flex-end;
  }
`;
