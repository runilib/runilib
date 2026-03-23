import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { useTheme } from './hooks/useTheme'
import { useI18n }  from './hooks/useI18n'
import { AppProvider } from './context/AppContext'
import { Navbar }   from './components/Navbar'
import { Footer }   from './components/Footer'
import { Home }     from './pages/Home'
import { Libraries }  from './pages/Libraries'
import { LibraryDetail } from './pages/LibraryDetail'
import { Docs }     from './pages/Docs'
import { Ecosystem, NotFound } from './pages/Ecosystem'
import { Contributing } from './pages/Contributing'

// ── Global styles ─────────────────────────────────────────────

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background:  ${({ theme }) => theme.bg};
    color:       ${({ theme }) => theme.textPrimary};
    font-family: 'Sora', sans-serif;
    -webkit-font-smoothing: antialiased;
    transition: background 0.25s, color 0.25s;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar             { width: 5px; }
  ::-webkit-scrollbar-track       { background: ${({ theme }) => theme.bg}; }
  ::-webkit-scrollbar-thumb       { background: ${({ theme }) => theme.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => theme.teal}55; }

  ::selection {
    background: ${({ theme }) => theme.teal}28;
    color: ${({ theme }) => theme.textPrimary};
  }

  button { font-family: inherit; }
  img    { max-width: 100%; }
`

// ── Scroll to top on route change ────────────────────────────

function ScrollTop() {
  const { pathname } = useLocation()
  React.useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// ── Inner app (needs BrowserRouter context) ───────────────────

function Inner() {
  return (
    <>
      <ScrollTop />
      <Navbar />
      <Routes>
        <Route path="/"                   element={<Home />} />
        <Route path="/libraries"          element={<Libraries />} />
        <Route path="/libraries/:id"      element={<LibraryDetail />} />
        <Route path="/docs"               element={<Docs />} />
        <Route path="/docs/:id"           element={<LibraryDetail />} />
        <Route path="/ecosystem"          element={<Ecosystem />} />
        <Route path="/contributing"       element={<Contributing />} />
        <Route path="*"                   element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

// ── Root App ─────────────────────────────────────────────────

export default function App() {
  const { theme, isDark, toggle: toggleTheme } = useTheme()
  const { locale, t, setLocale, toggle: toggleLocale } = useI18n()

  const ctx = { theme, isDark, toggleTheme, locale, t, setLocale, toggleLocale }

  return (
    <AppProvider value={ctx}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Inner />
        </BrowserRouter>
      </ThemeProvider>
    </AppProvider>
  )
}
