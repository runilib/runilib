import React from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { WEBSITE_FEATURES } from './config/features';
import { AppProvider } from './context/AppContext';
import { useI18n } from './hooks/useI18n';
import { useTheme } from './hooks/useTheme';
import { Contributing } from './pages/Contributing';
import { Docs } from './pages/Docs';
import { Ecosystem, NotFound } from './pages/Ecosystem';
import { Home } from './pages/Home';
import { Libraries } from './pages/Libraries';
import { LibraryDetail } from './pages/LibraryDetail';
import { GlobalStyle } from './theme/styles';

// ── Scroll to top on route change ────────────────────────────

function ScrollTop() {
  const { pathname } = useLocation();
  const previousPathnameRef = React.useRef(pathname);

  React.useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      previousPathnameRef.current = pathname;
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

function DocsLibraryRedirect() {
  const { id } = useParams<{ id: string }>();

  return (
    <Navigate
      to={id ? `/libraries/${id}` : '/libraries'}
      replace
    />
  );
}

function Inner() {
  return (
    <>
      <ScrollTop />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/libraries"
          element={<Libraries />}
        />
        <Route
          path="/libraries/:id"
          element={<LibraryDetail />}
        />
        <Route
          path="/docs"
          element={
            WEBSITE_FEATURES.docs ? (
              <Docs />
            ) : (
              <Navigate
                to="/libraries"
                replace
              />
            )
          }
        />
        <Route
          path="/docs/:id"
          element={WEBSITE_FEATURES.docs ? <LibraryDetail /> : <DocsLibraryRedirect />}
        />
        <Route
          path="/ecosystem"
          element={<Ecosystem />}
        />
        <Route
          path="/contributing"
          element={<Contributing />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
      <Footer />
    </>
  );
}

// ── Root App ─────────────────────────────────────────────────

export default function App() {
  const { theme, isDark, toggle: toggleTheme } = useTheme();
  const { locale, t, setLocale, toggle: toggleLocale } = useI18n();

  const ctx = { theme, isDark, toggleTheme, locale, t, setLocale, toggleLocale };

  return (
    <AppProvider value={ctx}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <BrowserRouter>
          <Inner />
        </BrowserRouter>
      </ThemeProvider>
    </AppProvider>
  );
}
