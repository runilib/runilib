import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { SelectOption } from '../../types/field';

export type AsyncDependencyShape = Record<string, unknown>;
export type AsyncDependencyKey<TDeps extends AsyncDependencyShape> = Extract<
  keyof TDeps,
  string
>;

export interface OptionsFetcherContext<
  TDeps extends AsyncDependencyShape = Record<string, never>,
> {
  search: string;
  deps: TDeps;
  signal: AbortSignal;
}

export type OptionsFetcher<TDeps extends AsyncDependencyShape = Record<string, never>> = (
  context: OptionsFetcherContext<TDeps>,
) => Promise<SelectOption[]>;

export interface AsyncOptionsConfig<
  TDeps extends AsyncDependencyShape = Record<string, never>,
> {
  key?: string;
  fetch: OptionsFetcher<TDeps>;
  cacheTtl?: number;
  debounce?: number;
  minChars?: number;
  dependsOn?: readonly AsyncDependencyKey<TDeps>[];
  initialOptions?: SelectOption[];
  fetchOnMount?: boolean;
  keepPreviousOptions?: boolean;
  preserveOnError?: boolean;
}

export interface UseAsyncOptionsReturn {
  options: SelectOption[];
  loading: boolean;
  error: string | null;
  search: string;
  setSearch: (query: string) => void;
  clearSearch: () => void;
  refresh: () => void;
}

interface CacheEntry {
  options: SelectOption[];
  expiresAt: number;
}

const CACHE = new Map<string, CacheEntry>();
const EMPTY_OPTIONS: SelectOption[] = [];
const EMPTY_DEP_KEYS: readonly string[] = [];

function buildDependsOnFingerprint(dependsOn: readonly string[]): string {
  return JSON.stringify(dependsOn);
}

function getCached(key: string): SelectOption[] | null {
  const entry = CACHE.get(key);
  if (!entry) return null;

  if (entry.expiresAt > 0 && Date.now() > entry.expiresAt) {
    CACHE.delete(key);
    return null;
  }

  return entry.options;
}

function setCached(key: string, options: SelectOption[], ttl: number): void {
  CACHE.set(key, {
    options,
    expiresAt: ttl > 0 ? Date.now() + ttl : 0,
  });
}

function buildRelevantDeps<TDeps extends AsyncDependencyShape>(
  dependsOn: readonly AsyncDependencyKey<TDeps>[],
  depValues: Record<string, unknown>,
): TDeps {
  const result = {} as TDeps;

  for (const key of dependsOn) {
    result[key] = depValues[key] as TDeps[typeof key];
  }

  return result;
}

function buildDepsFingerprint<TDeps extends AsyncDependencyShape>(
  dependsOn: readonly AsyncDependencyKey<TDeps>[],
  depValues: Record<string, unknown>,
): string {
  return JSON.stringify(dependsOn.map((key) => [key, depValues[key] ?? null]));
}

export function useAsyncOptions<TDeps extends AsyncDependencyShape>(
  config: AsyncOptionsConfig<TDeps>,
  depValues: Record<string, unknown> = {},
): UseAsyncOptionsReturn {
  const {
    key = 'default',
    fetch: fetchFn,
    cacheTtl = 60_000,
    debounce: debounceMs = 300,
    minChars = 0,
    dependsOn = EMPTY_DEP_KEYS as readonly AsyncDependencyKey<TDeps>[],
    initialOptions = EMPTY_OPTIONS,
    fetchOnMount = true,
    keepPreviousOptions = true,
    preserveOnError = true,
  } = config;

  const fetchRef = useRef(fetchFn);
  fetchRef.current = fetchFn;

  const dependsOnFingerprint = useMemo(
    () =>
      buildDependsOnFingerprint(
        (Array.isArray(dependsOn) ? dependsOn : EMPTY_DEP_KEYS) as readonly string[],
      ),
    [dependsOn],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const stableDependsOn = useMemo(
    () =>
      (Array.isArray(dependsOn)
        ? [...dependsOn]
        : EMPTY_DEP_KEYS) as readonly AsyncDependencyKey<TDeps>[],
    [dependsOnFingerprint, dependsOn],
  );
  const safeInitialOptions = useMemo(
    () => (Array.isArray(initialOptions) ? initialOptions : EMPTY_OPTIONS),
    [initialOptions],
  );

  const [options, setOptions] = useState<SelectOption[]>(safeInitialOptions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearchState] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const mountedRef = useRef(true);

  const depsFingerprint = useMemo(
    () => buildDepsFingerprint<TDeps>(stableDependsOn, depValues),
    [stableDependsOn, depValues],
  );

  const relevantDeps = useMemo(
    () => buildRelevantDeps<TDeps>(stableDependsOn, depValues),
    [stableDependsOn, depValues],
  );

  const cacheKey = useMemo(
    () => `${key}::${search.trim()}::${depsFingerprint}`,
    [key, search, depsFingerprint],
  );

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const doFetch = useCallback(
    async (searchValue: string, depsSnapshot: TDeps, force = false) => {
      const normalizedSearch = searchValue.trim();
      const requestId = ++requestIdRef.current;

      abortRef.current?.abort();
      abortRef.current = null;

      if (normalizedSearch.length > 0 && normalizedSearch.length < minChars) {
        setLoading(false);
        setError(null);
        setOptions(safeInitialOptions);
        return;
      }

      const currentCacheKey = `${key}::${normalizedSearch}::${JSON.stringify(
        stableDependsOn.map((depKey) => [depKey, depsSnapshot[depKey] ?? null]),
      )}`;

      if (!force) {
        const cached = getCached(currentCacheKey);
        if (cached) {
          setOptions(Array.isArray(cached) ? cached : []);
          setError(null);
          setLoading(false);
          return;
        }
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      setError(null);

      if (!keepPreviousOptions) {
        setOptions(safeInitialOptions);
      }

      try {
        const result = await fetchRef.current({
          search: normalizedSearch,
          deps: depsSnapshot,
          signal: controller.signal,
        });

        if (!mountedRef.current) return;
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;

        const nextOptions = Array.isArray(result) ? result : [];
        setCached(currentCacheKey, nextOptions, cacheTtl);
        setOptions(nextOptions);
      } catch (err) {
        if (!mountedRef.current) return;
        if (controller.signal.aborted) return;
        if (requestId !== requestIdRef.current) return;

        setError(err instanceof Error ? err.message : 'Failed to load options.');

        if (!preserveOnError) {
          setOptions(safeInitialOptions);
        }
      } finally {
        if (mountedRef.current && requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [
      cacheTtl,
      keepPreviousOptions,
      key,
      minChars,
      preserveOnError,
      safeInitialOptions,
      stableDependsOn,
    ],
  );

  useEffect(() => {
    if (!fetchOnMount && refreshTick === 0 && search.trim() === '') {
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(
      () => {
        void doFetch(search, relevantDeps);
      },
      search.trim() ? debounceMs : 0,
    );

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [debounceMs, doFetch, fetchOnMount, refreshTick, search, relevantDeps]);

  const setSearch = useCallback((query: string) => {
    setSearchState(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchState('');
  }, []);

  const refresh = useCallback(() => {
    CACHE.delete(cacheKey);
    setRefreshTick((value) => value + 1);
  }, [cacheKey]);

  return {
    options,
    loading,
    error,
    search,
    setSearch,
    clearSearch,
    refresh,
  };
}
