'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { darkTheme, lightTheme } from '@/theme';
import { GlobalStyle } from '@/theme/global-style';

import { ThemeProvider } from 'styled-components';

type ThemeMode = 'light' | 'dark';

type ThemeModeContextValue = {
  mode: ThemeMode;
  toggle: () => void;
};

const THEME_STORAGE_KEY = 'react-formbridge-docs-theme';

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

export const ThemeProviders = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedMode = globalThis.localStorage.getItem(THEME_STORAGE_KEY);

    if (savedMode === 'light' || savedMode === 'dark') {
      setMode(savedMode);
    }
  }, []);

  useEffect(() => {
    globalThis.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggle: () =>
        setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export function useThemeMode() {
  const context = useContext(ThemeModeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProviders');
  }

  return context;
}
