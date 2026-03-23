import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AppProvider } from "./context/AppContext";
import { useI18n } from "./hooks/useI18n";
import { useTheme } from "./hooks/useTheme";
import { Docs } from "./pages/Docs";
import { Ecosystem, NotFound } from "./pages/Ecosystem";
import { Home } from "./pages/Home";
import { Libraries } from "./pages/Libraries";
import { LibraryDetail } from "./pages/LibraryDetail";
import { GlobalStyle } from "./theme/styles";
import { Contributing } from "./pages/Contributing";



// ── Scroll to top on route change ────────────────────────────

function ScrollTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}


function Inner() {
  return (
    <>
      <ScrollTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/libraries" element={<Libraries />} />
        <Route path="/libraries/:id" element={<LibraryDetail />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:id" element={<LibraryDetail />} />
        <Route path="/ecosystem" element={<Ecosystem />} />
        <Route path="/contributing" element={<Contributing />} />
        <Route path="*" element={<NotFound />} />
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
