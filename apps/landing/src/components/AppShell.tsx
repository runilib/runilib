'use client';

import { ThemeProvider } from 'styled-components';
import { AppProvider } from '../context/AppContext';
import { useI18n } from '../hooks/useI18n';
import { useTheme } from '../hooks/useTheme';
import { GlobalStyle } from '../theme/styles';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { StyledRegistry } from './StyledRegistry';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, isDark, toggle: toggleTheme } = useTheme();
  const { locale, t, setLocale, toggle: toggleLocale } = useI18n();

  const ctx = { theme, isDark, toggleTheme, locale, t, setLocale, toggleLocale };

  return (
    <StyledRegistry>
      <AppProvider value={ctx}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </AppProvider>
    </StyledRegistry>
  );
}
