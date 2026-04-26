import { useEffect, useRef, useState } from 'react';

export type NpmDownloadsPeriod = 'last-day' | 'last-week' | 'last-month' | 'last-year';

interface UseNpmDownloadsOptions {
  packages: string[];
  period?: NpmDownloadsPeriod;
}

interface CachedData {
  downloads: Record<string, number>;
  timestamp: number;
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function buildCacheKey(packages: string[], period: NpmDownloadsPeriod) {
  return `runilib-npm-downloads:${period}:${packages.slice().sort().join('|')}`;
}

function getCached(cacheKey: string): Record<string, number> | null {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return cached.downloads;
  } catch {
    return null;
  }
}

function setCache(cacheKey: string, downloads: Record<string, number>) {
  try {
    const data: CachedData = { downloads, timestamp: Date.now() };
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // ignore storage errors
  }
}

export function useNpmDownloads({
  packages,
  period = 'last-week',
}: UseNpmDownloadsOptions): {
  downloads: Record<string, number>;
  loading: boolean;
} {
  const cacheKey = buildCacheKey(packages, period);

  const [downloads, setDownloads] = useState<Record<string, number>>(
    () => getCached(cacheKey) ?? {},
  );
  const [loading, setLoading] = useState(() => getCached(cacheKey) === null);

  // cacheKey already encodes the sorted package list, so we read packages
  // through a ref to avoid re-firing the effect on each render's fresh array.
  const packagesRef = useRef(packages);
  packagesRef.current = packages;

  useEffect(() => {
    const cached = getCached(cacheKey);
    if (cached) {
      setDownloads(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;

    // npm bulk endpoint does not support scoped packages, so we fan out one
    // request per package. The endpoint is unauthenticated and rate-friendly.
    const requests = packagesRef.current.map(async (pkg) => {
      const response = await fetch(
        `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(pkg)}`,
      );

      if (!response.ok) {
        throw new Error(`npm API ${response.status} for ${pkg}`);
      }

      const json = (await response.json()) as { downloads: number; package: string };

      return [pkg, json.downloads] as const;
    });

    Promise.allSettled(requests)
      .then((results) => {
        if (cancelled) return;

        const merged: Record<string, number> = {};

        for (const result of results) {
          if (result.status === 'fulfilled') {
            const [pkg, count] = result.value;
            merged[pkg] = count;
          }
        }

        setDownloads(merged);

        if (Object.keys(merged).length > 0) {
          setCache(cacheKey, merged);
        }
      })
      .catch(() => {
        // keep whatever we have on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, period]);

  return { downloads, loading };
}

export function formatDownloadsCompact(value: number): string {
  if (value < 1000) {
    return String(value);
  }

  if (value < 1_000_000) {
    return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0)}K`;
  }

  return `${(value / 1_000_000).toFixed(1)}M`;
}
