import { useEffect, useState } from 'react';

export interface GitHubContributor {
  handle: string;
  name: string;
  avatarUrl: string;
  profileUrl: string;
  contributions: number;
}

interface UseGitHubContributorsOptions {
  repo?: string;
  repos?: string[];
  perPage?: number;
  fallback: GitHubContributor[];
}

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

interface CachedData {
  contributors: GitHubContributor[];
  timestamp: number;
}

interface GitHubApiContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

function buildCacheKey(reposKey: string, perPage: number) {
  return `runilib-github-contributors:${reposKey}:${perPage}`;
}

function getCached(cacheKey: string): GitHubContributor[] | null {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return cached.contributors;
  } catch {
    return null;
  }
}

function setCache(cacheKey: string, contributors: GitHubContributor[]) {
  try {
    const data: CachedData = { contributors, timestamp: Date.now() };
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // silently ignore storage errors
  }
}

export function useGitHubContributors({
  repo,
  repos,
  perPage = 30,
  fallback,
}: UseGitHubContributorsOptions): {
  contributors: GitHubContributor[];
  loading: boolean;
} {
  const normalizedRepos = [
    ...new Set((repos && repos.length > 0 ? repos : repo ? [repo] : []).filter(Boolean)),
  ];
  const reposKey = normalizedRepos.sort().join('|');
  const normalizedRepoList = normalizedRepos.join('\u0000');
  const cacheKey = buildCacheKey(reposKey, perPage);

  const [contributors, setContributors] = useState<GitHubContributor[]>(
    () => getCached(cacheKey) ?? fallback,
  );
  const [loading, setLoading] = useState(() => getCached(cacheKey) === null);

  useEffect(() => {
    const cached = getCached(cacheKey);
    if (cached) {
      setContributors(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const requestRepos = normalizedRepoList ? normalizedRepoList.split('\u0000') : [];

    const fetchContributors = async (targetRepo: string) => {
      const params = new URLSearchParams({ per_page: String(perPage) });
      const response = await fetch(
        `https://api.github.com/repos/${targetRepo}/contributors?${params}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      return (await response.json()) as GitHubApiContributor[];
    };

    const requests = requestRepos.map((targetRepo) => fetchContributors(targetRepo));

    Promise.allSettled(requests)
      .then((results) => {
        if (cancelled) return;

        const merged = new Map<string, GitHubContributor>();

        for (const result of results) {
          if (result.status !== 'fulfilled') continue;

          for (const user of result.value) {
            if (user.type !== 'User') continue;
            const existing = merged.get(user.login);
            if (existing) {
              existing.contributions += user.contributions;
            } else {
              merged.set(user.login, {
                handle: user.login,
                name: user.login,
                avatarUrl: user.avatar_url,
                profileUrl: user.html_url,
                contributions: user.contributions,
              });
            }
          }
        }

        const mapped = [...merged.values()].sort(
          (a, b) => b.contributions - a.contributions,
        );

        if (mapped.length > 0) {
          setContributors(mapped);
          setCache(cacheKey, mapped);
        } else {
          setContributors(fallback);
          sessionStorage.removeItem(cacheKey);
        }
      })
      .catch(() => {
        // keep fallback data on error
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cacheKey, fallback, normalizedRepoList, perPage]);

  return { contributors, loading };
}
