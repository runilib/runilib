/**
 * formura — Async / Remote Options
 * ──────────────────────────────────────
 * Load select/radio options from an API, with:
 * - Loading state
 * - Error state
 * - Caching (TTL)
 * - Debounced search
 * - Dependent options (reload when another field changes)
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { SelectOption } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export type OptionsFetcher = (
  search?:    string,
  depValues?: Record<string, unknown>,
) => Promise<SelectOption[]>;

export interface AsyncOptionsConfig {
  /** Async function to fetch options */
  fetch:            OptionsFetcher;
  /**
   * Cache TTL in ms. 0 = no cache. Default: 60_000 (1 minute).
   */
  cacheTtl?:        number;
  /**
   * Debounce ms for search queries. Default: 300.
   */
  debounce?:        number;
  /**
   * Minimum characters before triggering a search. Default: 0.
   */
  minChars?:        number;
  /**
   * Field names whose values trigger a re-fetch (dependent options).
   * @example ['country'] → options reload when 'country' changes.
   */
  dependsOn?:       string[];
  /**
   * Initial options to show before loading (e.g. most popular).
   */
  initialOptions?:  SelectOption[];
  /**
   * Whether to fetch on mount. Default: true.
   */
  fetchOnMount?:    boolean;
}

export interface UseAsyncOptionsReturn {
  /** Current list of options */
  options:    SelectOption[];
  /** True while fetching */
  loading:    boolean;
  /** Error message if fetch failed */
  error:      string | null;
  /** Set the search query (triggers re-fetch with debounce) */
  setSearch:  (query: string) => void;
  /** Current search query */
  search:     string;
  /** Manually trigger a refresh */
  refresh:    () => void;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

interface CacheEntry { options: SelectOption[]; expiresAt: number; }
const CACHE = new Map<string, CacheEntry>();

function getCached(key: string): SelectOption[] | null {
  const entry = CACHE.get(key);
  if (!entry) return null;
  if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) { CACHE.delete(key); return null; }
  return entry.options;
}

function setCached(key: string, options: SelectOption[], ttl: number): void {
  CACHE.set(key, { options, expiresAt: ttl > 0 ? Date.now() + ttl : 0 });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * `useAsyncOptions` — load select options from an API.
 *
 * @example
 * // Simple fetch on mount
 * const { options, loading } = useAsyncOptions({
 *   fetch: () => api.getCountries(),
 * });
 *
 * @example
 * // Searchable with debounce
 * const { options, loading, setSearch } = useAsyncOptions({
 *   fetch:    (search) => api.searchCities(search),
 *   debounce: 400,
 *   minChars: 2,
 * });
 *
 * @example
 * // Dependent options (reload when 'country' changes)
 * const { options, loading } = useAsyncOptions({
 *   fetch:     (_, deps) => api.getCities(deps?.country),
 *   dependsOn: ['country'],
 * }, { country: watch('country') });
 */
export function useAsyncOptions(
  config:    AsyncOptionsConfig,
  depValues: Record<string, unknown> = {},
): UseAsyncOptionsReturn {
  const {
    fetch:         fetchFn,
    cacheTtl      = 60_000,
    debounce:      debounceMs = 300,
    minChars      = 0,
    dependsOn     = [],
    initialOptions = [],
    fetchOnMount  = true,
  } = config;

  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearchState] = useState('');
  const [version, setVersion] = useState(0);  // increment to trigger refresh

  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef    = useRef<AbortController | null>(null);
  const mountedRef  = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  // Build a cache key from search + dep values
  const cacheKey = useMemo(() => {
    const depStr = dependsOn.map(k => `${k}:${depValues[k]}`).join(',');
    return `${search}|${depStr}`;
  }, [search, dependsOn, depValues]);

  // ── Core fetch ─────────────────────────────────────────────────────────────

  const doFetch = useCallback(async (q: string, deps: Record<string, unknown>) => {
    // Check min chars
    if (q.length < minChars && q.length > 0) return;

    const key = `${q}|${dependsOn.map(k => `${k}:${deps[k]}`).join(',')}`;

    // Cache hit
    const cached = getCached(key);
    if (cached) { setOptions(cached); return; }

    // Abort previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(q || undefined, Object.keys(deps).length ? deps : undefined);
      if (!mountedRef.current) return;
      setCached(key, result, cacheTtl);
      setOptions(result);
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      if (err instanceof Error && err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Failed to load options.');
      setOptions(initialOptions);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetchFn, cacheTtl, dependsOn, minChars, initialOptions]);

  // ── Trigger fetch on mount and when deps change ───────────────────────────

  useEffect(() => {
    if (!fetchOnMount && version === 0) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doFetch(search, depValues), search ? debounceMs : 0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [cacheKey, version, fetchOnMount]); // eslint-disable-line

  // ── Search handler ────────────────────────────────────────────────────────

  const setSearch = useCallback((q: string) => {
    setSearchState(q);
    // doFetch will be triggered by the cacheKey effect change
  }, []);

  const refresh = useCallback(() => {
    CACHE.delete(cacheKey);
    setVersion(v => v + 1);
  }, [cacheKey]);

  return { options, loading, error, setSearch, search, refresh };
}

// ─── Field builder extension ──────────────────────────────────────────────────

/**
 * Mixin for select/radio field builders.
 * Adds .optionsFrom(fetcher) and .searchable() to the builder.
 */
export interface AsyncOptionsMeta {
  _asyncOptions?: AsyncOptionsConfig;
  _searchable:    boolean;
}

export class AsyncOptionsMixin {
  _asyncOptionsMeta: AsyncOptionsMeta = { _searchable: false };

  /**
   * Load options asynchronously from an API.
   *
   * @example
   * field.select('Country')
   *   .optionsFrom(async () => {
   *     const r = await fetch('/api/countries');
   *     return r.json(); // [{ label: 'France', value: 'FR' }, ...]
   *   })
   *   .searchable()
   *
   * @example
   * // With dependencies — reload when 'country' changes
   * field.select('City')
   *   .optionsFrom(
   *     async (search, deps) => api.getCities(deps?.country, search),
   *     { dependsOn: ['country'], debounce: 400, minChars: 2 }
   *   )
   *   .searchable()
   */
  optionsFrom(
    fetcher: OptionsFetcher,
    config:  Omit<AsyncOptionsConfig, 'fetch'> = {},
  ): this {
    this._asyncOptionsMeta._asyncOptions = { fetch: fetcher, ...config };
    return this;
  }

  /** Make the options list searchable (shows a search input inside the dropdown) */
  searchable(value = true): this {
    this._asyncOptionsMeta._searchable = value;
    return this;
  }
}
