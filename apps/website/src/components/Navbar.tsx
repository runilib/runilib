import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { LogoFull } from './Logo'
import { useApp } from '../context/AppContext'

const slideIn = keyframes`
  from { opacity:0; transform:translateY(-10px); }
  to   { opacity:1; transform:translateY(0); }
`

export function Navbar() {
  const { t, isDark, toggleTheme, locale, toggleLocale } = useApp()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const location = useLocation()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const links = [
    { to: '/',             label: t.nav.home },
    { to: '/libraries',    label: t.nav.libraries },
    { to: '/docs',         label: t.nav.docs },
    { to: '/ecosystem',    label: t.nav.ecosystem },
    { to: '/contributing', label: t.contributing.nav },
  ]

  return (
    <NavWrap $scrolled={scrolled}>
      <NavInner>
        <LogoFull hideTagline />

        <NavLinks>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              $active={location.pathname === l.to || (l.to !== '/' && location.pathname.startsWith(l.to))}
            >
              {l.label}
            </NavLink>
          ))}
        </NavLinks>

        <NavRight>
          <LangBtn onClick={toggleLocale} title="Switch language">
            {locale === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </LangBtn>

          <IconBtn
            as="a"
            href="https://github.com/runilib"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <GithubSvg />
            <span>GitHub</span>
          </IconBtn>

          <ThemeBtn onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <SunSvg /> : <MoonSvg />}
          </ThemeBtn>

          <BurgerBtn
            onClick={() => setMobileOpen(o => !o)}
            $open={mobileOpen}
            aria-label="Menu"
          >
            <BurgerLine $open={mobileOpen} $nth={1} />
            <BurgerLine $open={mobileOpen} $nth={2} />
            <BurgerLine $open={mobileOpen} $nth={3} />
          </BurgerBtn>
        </NavRight>
      </NavInner>

      {mobileOpen && (
        <MobileMenu>
          {links.map(l => (
            <MobileLink
              key={l.to}
              to={l.to}
              $active={location.pathname === l.to}
            >
              {l.label}
            </MobileLink>
          ))}
          <MobileDiv />
          <MobileLangRow>
            <MobileLangBtn $active={locale==='en'} onClick={()=>{ if(locale!=='en') toggleLocale() }}>
              🇬🇧 English
            </MobileLangBtn>
            <MobileLangBtn $active={locale==='fr'} onClick={()=>{ if(locale!=='fr') toggleLocale() }}>
              🇫🇷 Français
            </MobileLangBtn>
          </MobileLangRow>
        </MobileMenu>
      )}
    </NavWrap>
  )
}

// ── SVG icons ──────────────────────────────────────────────────

function GithubSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}
function SunSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}
function MoonSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  )
}

// ── Styled ─────────────────────────────────────────────────────

const NavWrap = styled.nav<{ $scrolled: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  background: ${({ theme, $scrolled }) => $scrolled ? theme.bgNavbar : 'transparent'};
  backdrop-filter: ${({ $scrolled }) => $scrolled ? 'blur(20px) saturate(1.4)' : 'none'};
  box-shadow: ${({ theme, $scrolled }) => $scrolled ? theme.shadowNavbar : 'none'};
  transition: background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s;
`
const NavInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`
const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  @media (max-width: 780px) { display: none; }
`
const NavLink = styled(Link)<{ $active: boolean }>`
  font-family: 'Sora', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  padding: 6px 13px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.18s;
  color: ${({ theme, $active }) => $active ? theme.teal : theme.textSecondary};
  background: ${({ theme, $active }) => $active ? theme.tealDim : 'transparent'};
  &:hover {
    color: ${({ theme }) => theme.textPrimary};
    background: ${({ theme }) => theme.tealDim};
  }
`
const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`
const btnBase = css`
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.18s;
  text-decoration: none;
  &:hover {
    border-color: ${({ theme }) => theme.teal};
    color: ${({ theme }) => theme.teal};
    background: ${({ theme }) => theme.tealDim};
  }
`
const LangBtn = styled.button`${btnBase}`
const IconBtn = styled.button`
  ${btnBase}
  @media (max-width: 540px) { span { display: none; } }
`
const ThemeBtn = styled.button`
  ${btnBase}
  width: 36px;
  padding: 6px;
  justify-content: center;
`
const BurgerBtn = styled.button<{ $open: boolean }>`
  display: none;
  flex-direction: column;
  gap: 5px;
  width: 36px; height: 36px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  @media (max-width: 780px) { display: flex; }
`
const BurgerLine = styled.span<{ $open: boolean; $nth: 1|2|3 }>`
  display: block;
  width: 16px; height: 1.5px;
  background: ${({ theme }) => theme.textSecondary};
  border-radius: 2px;
  transition: all 0.28s;
  ${({ $open, $nth }) => $open && $nth === 1 && css`transform: translateY(6.5px) rotate(45deg);`}
  ${({ $open, $nth }) => $open && $nth === 2 && css`opacity: 0; transform: scaleX(0);`}
  ${({ $open, $nth }) => $open && $nth === 3 && css`transform: translateY(-6.5px) rotate(-45deg);`}
`
const MobileMenu = styled.div`
  background: ${({ theme }) => theme.bgNavbar};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${({ theme }) => theme.border};
  padding: 14px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ${slideIn} 0.2s ease;
`
const MobileLink = styled(Link)<{ $active: boolean }>`
  font-family: 'Sora', sans-serif;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: ${({ theme, $active }) => $active ? theme.teal : theme.textSecondary};
  background: ${({ theme, $active }) => $active ? theme.tealDim : 'transparent'};
  transition: all 0.15s;
  &:hover { color: ${({ theme }) => theme.textPrimary}; background: ${({ theme }) => theme.tealDim}; }
`
const MobileDiv = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.border};
  margin: 8px 0;
`
const MobileLangRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 0 4px;
`
const MobileLangBtn = styled.button<{ $active: boolean }>`
  flex: 1;
  font-family: 'DM Mono', monospace;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $active }) => $active ? theme.teal : theme.border};
  background: ${({ theme, $active }) => $active ? theme.tealDim : 'transparent'};
  color: ${({ theme, $active }) => $active ? theme.teal : theme.textSecondary};
  cursor: pointer;
  transition: all 0.15s;
`
