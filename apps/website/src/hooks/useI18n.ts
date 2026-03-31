import { useCallback, useState } from 'react';

import { WEBSITE_FEATURES } from '../config/features';
import { translations } from '../i18n';
import type { Locale, Translations } from '../types';

export function useI18n(): {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
  toggle: () => void;
} {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (!WEBSITE_FEATURES.localePicker) {
      return WEBSITE_FEATURES.defaultLocale;
    }

    const saved = localStorage.getItem('runilib-locale') as Locale | null;
    if (saved === 'en' || saved === 'fr') return saved;
    const browser = navigator.language.toLowerCase();
    return browser.startsWith('fr') ? 'fr' : WEBSITE_FEATURES.defaultLocale;
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem('runilib-locale', l);
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === 'en' ? 'fr' : 'en');
  }, [locale, setLocale]);

  return { locale, t: translations[locale], setLocale, toggle };
}
