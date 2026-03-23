import React, { createContext, useContext } from "react";
import type { AppTheme, Locale, Translations } from "../types";

interface AppContextValue {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export const AppProvider = AppContext.Provider;
