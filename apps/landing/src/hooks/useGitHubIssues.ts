import { useEffect, useRef, useState } from 'react';

export interface GitHubIssue {
  tag: string;
  title: string;
  desc: string;
  color: string;
  url: string;
}

interface UseGitHubIssuesOptions {
  repo?: string;
  repos?: string[];
  labels: string[];
  perPage?: number;
  fallback: GitHubIssue[];
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const LABEL_COLORS: Record<string, string> = {
  'good first issue': 'teal',
  'help wanted': 'blue',
  bug: 'red',
  docs: 'purple',
  enhancement: 'amber',
};

interface CachedData {
  issues: GitHubIssue[];
  timestamp: number;
}

interface GitHubApiIssue {
  body: string | null;
  created_at: string;
  html_url: string;
  labels: Array<{ name: string }>;
  number: number;
  pull_request?: unknown;
  title: string;
}

function buildCacheKey(reposKey: string, labelsKey: string, perPage: number) {
  return `runilib-github-issues:${reposKey}:${labelsKey}:${perPage}`;
}

function getCached(cacheKey: string): GitHubIssue[] | null {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(cacheKey);
      return null;
    }
    return cached.issues;
  } catch {
    return null;
  }
}

function setCache(cacheKey: string, issues: GitHubIssue[]) {
  try {
    const data: CachedData = { issues, timestamp: Date.now() };
    sessionStorage.setItem(cacheKey, JSON.stringify(data));
  } catch {
    // silently ignore storage errors
  }
}

function pickColor(labels: Array<{ name: string }>): string {
  for (const label of labels) {
    const color = LABEL_COLORS[label.name.toLowerCase()];
    if (color) return color;
  }
  return 'teal';
}

function pickTag(labels: Array<{ name: string }>): string {
  const priority = ['good first issue', 'help wanted', 'docs', 'bug', 'enhancement'];
  for (const p of priority) {
    const match = labels.find((l) => l.name.toLowerCase() === p);
    if (match) return match.name.toLowerCase();
  }
  return labels[0]?.name.toLowerCase() ?? 'issue';
}

export function useGitHubIssues({
  repo,
  repos,
  labels,
  perPage = 6,
  fallback,
}: UseGitHubIssuesOptions): { issues: GitHubIssue[]; loading: boolean } {
  const normalizedRepos = [
    ...new Set((repos && repos.length > 0 ? repos : repo ? [repo] : []).filter(Boolean)),
  ];
  const reposKey = normalizedRepos.sort().join('|');
  const normalizedRepoList = normalizedRepos.join('\u0000');
  const normalizedLabels = [
    ...new Set(labels.map((label) => label.trim()).filter(Boolean)),
  ];
  const labelsKey = normalizedLabels
    .map((label) => label.toLowerCase())
    .sort()
    .join('|');
  const normalizedLabelList = normalizedLabels.join('\u0000');
  const cacheKey = buildCacheKey(reposKey, labelsKey, perPage);

  const [issues, setIssues] = useState<GitHubIssue[]>(
    () => getCached(cacheKey) ?? fallback,
  );
  const [loading, setLoading] = useState(() => getCached(cacheKey) === null);

  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  useEffect(() => {
    const cached = getCached(cacheKey);
    if (cached) {
      setIssues(cached);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const requestRepos = normalizedRepoList ? normalizedRepoList.split('\u0000') : [];
    const requestLabels = normalizedLabelList ? normalizedLabelList.split('\u0000') : [];

    const fetchIssuesForLabel = async (targetRepo: string, label: string) => {
      const params = new URLSearchParams({
        direction: 'desc',
        per_page: String(perPage),
        sort: 'created',
        state: 'open',
      });

      if (label) {
        params.set('labels', label);
      }

      const response = await fetch(
        `https://api.github.com/repos/${targetRepo}/issues?${params}`,
        {
          headers: { Accept: 'application/vnd.github.v3+json' },
        },
      );

      if (!response.ok) {
        throw new Error(`GitHub API ${response.status}`);
      }

      return (await response.json()) as GitHubApiIssue[];
    };

    const requests = requestRepos.flatMap((targetRepo) =>
      requestLabels.map((label) => fetchIssuesForLabel(targetRepo, label)),
    );

    Promise.allSettled(requests)
      .then((results) => {
        if (cancelled) return;

        const uniqueIssues = new Map<string, GitHubApiIssue>();

        for (const result of results) {
          if (result.status !== 'fulfilled') continue;

          for (const issue of result.value) {
            if (issue.pull_request) continue;
            uniqueIssues.set(issue.html_url, issue);
          }
        }

        const mapped: GitHubIssue[] = [...uniqueIssues.values()]
          .sort(
            (left, right) =>
              new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
          )
          .slice(0, perPage)
          .map((issue) => ({
            tag: pickTag(issue.labels),
            title: issue.title,
            desc: issue.body ? issue.body.slice(0, 120).replace(/\n/g, ' ').trim() : '',
            color: pickColor(issue.labels),
            url: issue.html_url,
          }));

        if (mapped.length > 0) {
          setIssues(mapped);
          setCache(cacheKey, mapped);
        } else {
          setIssues(fallbackRef.current);
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
  }, [cacheKey, normalizedLabelList, normalizedRepoList, perPage]);

  return { issues, loading };
}
