import { useCallback, useState } from "react";
import { translations } from "../i18n";
import type { Locale, Translations } from "../types";

export function useI18n(): {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  toggle: () => void;
} {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem("runilib-locale") as Locale | null;
    if (saved === "en" || saved === "fr") return saved;
    const browser = navigator.language.toLowerCase();
    return browser.startsWith("fr") ? "fr" : "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("runilib-locale", l);
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "en" ? "fr" : "en");
  }, [locale, setLocale]);

  return { locale, t: translations[locale], setLocale, toggle };
}
