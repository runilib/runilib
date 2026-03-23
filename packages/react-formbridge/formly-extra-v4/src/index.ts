// ─── 8. Phone field ──────────────────────────────────────────────────────────
export { PhoneFieldBuilder, isPhoneDescriptor }   from './phone/PhoneField';
export { COUNTRIES, COUNTRIES_SORTED, getCountry,
         searchCountries, buildPhoneValue }        from './phone/countries';
export type { PhoneValue, CountryInfo, PhoneFieldMeta } from './phone/countries';

// ─── 11. DevTools ────────────────────────────────────────────────────────────
export { FormDevTools }                            from './devtools/FormDevTools';
export type { FormDevToolsProps, DevToolsPosition } from './devtools/FormDevTools';

// ─── 14. i18n ────────────────────────────────────────────────────────────────
export { setLocale, t, tOr, getLocale, registerLocale } from './i18n/locale';
export {
  LOCALE_EN, LOCALE_FR, LOCALE_ES, LOCALE_DE, LOCALE_PT,
}                                                  from './i18n/locale';
export type { LocaleMessages, PartialMessages }    from './i18n/locale';

// ─── 15. Analytics ───────────────────────────────────────────────────────────
export { FormAnalyticsTracker, useFormAnalytics }  from './analytics/analytics';
export type { AnalyticsCallbacks, AnalyticsOptions } from './analytics/analytics';

// ─── 18. Async options ───────────────────────────────────────────────────────
export { useAsyncOptions, AsyncOptionsMixin }      from './async-options/useAsyncOptions';
export type {
  OptionsFetcher,
  AsyncOptionsConfig,
  UseAsyncOptionsReturn,
}                                                  from './async-options/useAsyncOptions';
