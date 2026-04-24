'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled, { css, keyframes } from 'styled-components';
import { WEBSITE_FEATURES } from '../config/features';
import { useApp } from '../context/AppContext';
import { LogoFull } from './Logo';

const slideIn = keyframes`
  from { opacity:0; transform:translateY(-10px); }
  to   { opacity:1; transform:translateY(0); }
`;

export function Navbar() {
  const { t, isDark, toggleTheme, locale, toggleLocale } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      setMobileOpen(false);
    }
  }, [pathname]);

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/libraries', label: t.nav.libraries },
    { href: '/contributing', label: t.contributing.nav },
  ];
  if (WEBSITE_FEATURES.docs) {
    links.splice(2, 0, { href: '/docs', label: t.nav.docs });
  }
  if (WEBSITE_FEATURES.ecosystemNav) {
    links.splice(WEBSITE_FEATURES.docs ? 3 : 2, 0, {
      href: '/ecosystem',
      label: t.nav.ecosystem,
    });
  }
  const socialLinks = [
    {
      href: 'https://github.com/runilib/runilib',
      label: 'GitHub',
      title: 'GitHub',
      icon: <GithubSvg />,
    },
    {
      href: 'https://discord.gg/sHz9WnFs2t',
      label: 'Discord',
      title: 'Discord',
      icon: <DiscordSvg />,
    },
  ];

  return (
    <NavWrap $scrolled={scrolled}>
      <NavInner>
        <LogoFull hideTagline />
        <NavLinks>
          {links.map((l) => (
            <NavLink
              key={l.href}
              href={l.href}
              $active={
                pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href))
              }
            >
              {l.label}
            </NavLink>
          ))}
        </NavLinks>
        <NavRight>
          {WEBSITE_FEATURES.localePicker && (
            <LangBtn
              onClick={toggleLocale}
              title="Switch language"
            >
              {locale === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
            </LangBtn>
          )}
          {socialLinks.map((link) => (
            <IconBtn
              key={link.label}
              as="a"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={link.title}
              aria-label={link.title}
            >
              {link.icon}
            </IconBtn>
          ))}
          <ThemeBtn
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? <SunSvg /> : <MoonSvg />}
          </ThemeBtn>
          <BurgerBtn
            onClick={() => setMobileOpen((o) => !o)}
            $open={mobileOpen}
            aria-label="Menu"
          >
            <BurgerLine
              $open={mobileOpen}
              $nth={1}
            />
            <BurgerLine
              $open={mobileOpen}
              $nth={2}
            />
            <BurgerLine
              $open={mobileOpen}
              $nth={3}
            />
          </BurgerBtn>
        </NavRight>
      </NavInner>
      {mobileOpen && (
        <MobileMenu>
          {links.map((l) => (
            <MobileLink
              key={l.href}
              href={l.href}
              $active={pathname === l.href}
            >
              {l.label}
            </MobileLink>
          ))}
          {WEBSITE_FEATURES.localePicker && (
            <>
              <MobileDiv />
              <MobileLangRow>
                <MobileLangBtn
                  $active={locale === 'en'}
                  onClick={() => {
                    if (locale !== 'en') toggleLocale();
                  }}
                >
                  🇬🇧 English
                </MobileLangBtn>
                <MobileLangBtn
                  $active={locale === 'fr'}
                  onClick={() => {
                    if (locale !== 'fr') toggleLocale();
                  }}
                >
                  🇫🇷 Français
                </MobileLangBtn>
              </MobileLangRow>
              <MobileDiv />
            </>
          )}
          <MobileSocialRow>
            {socialLinks.map((link) => (
              <MobileSocialLink
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.icon}
                <span>{link.label}</span>
              </MobileSocialLink>
            ))}
          </MobileSocialRow>
        </MobileMenu>
      )}
    </NavWrap>
  );
}

function GithubSvg() {
  return (
    <svg
      aria-label="image"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
function DiscordSvg() {
  return (
    <svg
      aria-label="image"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.013.043.031.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
function SunSvg() {
  return (
    <svg
      aria-label="image"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle
        cx="12"
        cy="12"
        r="5"
      />
      <line
        x1="12"
        y1="1"
        x2="12"
        y2="3"
      />
      <line
        x1="12"
        y1="21"
        x2="12"
        y2="23"
      />
      <line
        x1="4.22"
        y1="4.22"
        x2="5.64"
        y2="5.64"
      />
      <line
        x1="18.36"
        y1="18.36"
        x2="19.78"
        y2="19.78"
      />
      <line
        x1="1"
        y1="12"
        x2="3"
        y2="12"
      />
      <line
        x1="21"
        y1="12"
        x2="23"
        y2="12"
      />
      <line
        x1="4.22"
        y1="19.78"
        x2="5.64"
        y2="18.36"
      />
      <line
        x1="18.36"
        y1="5.64"
        x2="19.78"
        y2="4.22"
      />
    </svg>
  );
}
function MoonSvg() {
  return (
    <svg
      aria-label="image"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const NavWrap = styled.nav<{ $scrolled: boolean }>`
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  background: ${({ theme, $scrolled }) => ($scrolled ? theme.bgNavbar : 'transparent')};
  backdrop-filter: ${({ $scrolled }) => ($scrolled ? 'blur(20px) saturate(1.4)' : 'none')};
  box-shadow: ${({ theme, $scrolled }) => ($scrolled ? theme.shadowNavbar : 'none')};
  transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
`;
const NavInner = styled.div`
  max-width: 1240px; margin: 0 auto; padding: 0 24px; height: 64px;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
`;
const NavLinks = styled.div`
  display: flex; align-items: center; gap: 2px;
  @media (max-width: 780px) { display: none; }
`;
const NavLink = styled(Link)<{ $active: boolean }>`
  font-family: 'Sora', sans-serif; font-size: 13.5px; font-weight: 500;
  padding: 6px 13px; border-radius: 8px; text-decoration: none; transition: all 0.18s;
  color: ${({ theme, $active }) => ($active ? theme.teal : theme.textSecondary)};
  background: ${({ theme, $active }) => ($active ? theme.tealDim : 'transparent')};
  &:hover { color: ${({ theme }) => theme.textPrimary}; background: ${({ theme }) => theme.tealDim}; }
`;
const NavRight = styled.div`display: flex; align-items: center; gap: 8px; flex-shrink: 0;`;
const btnBase = css`
  font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 500;
  padding: 6px 12px; border-radius: 8px; border: 1px solid ${({ theme }) => theme.border};
  background: transparent; color: ${({ theme }) => theme.textSecondary};
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: all 0.18s; text-decoration: none;
  &:hover { border-color: ${({ theme }) => theme.teal}; color: ${({ theme }) => theme.teal}; background: ${({ theme }) => theme.tealDim}; }
`;
const LangBtn = styled.button`${btnBase}`;
const IconBtn = styled.button`
  ${btnBase}
  @media (max-width: 1180px) { span { display: none; } padding: 6px; width: 36px; justify-content: center; }
`;
const ThemeBtn = styled.button`${btnBase} width: 36px; padding: 6px; justify-content: center;`;
const BurgerBtn = styled.button<{ $open: boolean }>`
  display: none; flex-direction: column; gap: 5px; width: 36px; height: 36px;
  border-radius: 8px; border: 1px solid ${({ theme }) => theme.border};
  background: transparent; cursor: pointer; align-items: center; justify-content: center;
  @media (max-width: 780px) { display: flex; }
`;
const BurgerLine = styled.span<{ $open: boolean; $nth: 1 | 2 | 3 }>`
  display: block; width: 16px; height: 1.5px;
  background: ${({ theme }) => theme.textSecondary}; border-radius: 2px; transition: all 0.28s;
  ${({ $open, $nth }) => $open && $nth === 1 && css`transform: translateY(6.5px) rotate(45deg);`}
  ${({ $open, $nth }) => $open && $nth === 2 && css`opacity: 0; transform: scaleX(0);`}
  ${({ $open, $nth }) => $open && $nth === 3 && css`transform: translateY(-6.5px) rotate(-45deg);`}
`;
const MobileMenu = styled.div`
  background: ${({ theme }) => theme.bgNavbar}; backdrop-filter: blur(20px);
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 14px 20px 18px; display: flex; flex-direction: column; gap: 2px;
  animation: ${slideIn} 0.2s ease;
`;
const MobileLink = styled(Link)<{ $active: boolean }>`
  font-family: 'Sora', sans-serif; font-size: 15px; font-weight: 500;
  padding: 10px 14px; border-radius: 8px; text-decoration: none;
  color: ${({ theme, $active }) => ($active ? theme.teal : theme.textSecondary)};
  background: ${({ theme, $active }) => ($active ? theme.tealDim : 'transparent')};
  transition: all 0.15s;
  &:hover { color: ${({ theme }) => theme.textPrimary}; background: ${({ theme }) => theme.tealDim}; }
`;
const MobileDiv = styled.div`height: 1px; background: ${({ theme }) => theme.border}; margin: 8px 0;`;
const MobileLangRow = styled.div`display: flex; gap: 8px; padding: 0 4px;`;
const MobileLangBtn = styled.button<{ $active: boolean }>`
  flex: 1; font-family: 'DM Mono', monospace; font-size: 12px; padding: 8px 14px; border-radius: 8px;
  border: 1px solid ${({ theme, $active }) => ($active ? theme.teal : theme.border)};
  background: ${({ theme, $active }) => ($active ? theme.tealDim : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.teal : theme.textSecondary)};
  cursor: pointer; transition: all 0.15s;
`;
const MobileSocialRow = styled.div`display: flex; flex-wrap: wrap; gap: 8px; padding: 0 4px;`;
const MobileSocialLink = styled.a`${btnBase} padding: 8px 12px;`;
