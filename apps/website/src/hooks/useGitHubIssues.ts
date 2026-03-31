import { useEffect, useState } from 'react';

export interface GitHubIssue {
  tag: string;
  title: string;
  desc: string;
  color: string;
  url: string;
}

interface UseGitHubIssuesOptions {
  repo: string;
  labels: string[];
  perPage?: number;
  fallback: GitHubIssue[];
}

const CACHE_KEY = 'runilib-github-issues';
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

function getCached(): GitHubIssue[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedData = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cached.issues;
  } catch {
    return null;
  }
}

function setCache(issues: GitHubIssue[]) {
  try {
    const data: CachedData = { issues, timestamp: Date.now() };
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
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
  labels,
  perPage = 6,
  fallback,
}: UseGitHubIssuesOptions): { issues: GitHubIssue[]; loading: boolean } {
  const [issues, setIssues] = useState<GitHubIssue[]>(() => getCached() ?? fallback);
  const [loading, setLoading] = useState(() => getCached() === null);

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setIssues(cached);
      setLoading(false);
      return;
    }

    const labelQuery = labels.map((l) => encodeURIComponent(l)).join(',');
    const url = `https://api.github.com/repos/${repo}/issues?labels=${labelQuery}&state=open&per_page=${perPage}&sort=created&direction=desc`;

    let cancelled = false;

    fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
      })
      .then((data: Array<{ title: string; body: string | null; html_url: string; labels: Array<{ name: string }> }>) => {
        if (cancelled) return;
        const mapped: GitHubIssue[] = data.map((issue) => ({
          tag: pickTag(issue.labels),
          title: issue.title,
          desc: issue.body ? issue.body.slice(0, 120).replace(/\n/g, ' ').trim() : '',
          color: pickColor(issue.labels),
          url: issue.html_url,
        }));
        setIssues(mapped);
        setCache(mapped);
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
  }, [repo, labels.join(""), perPage]);

  return { issues, loading };
}
