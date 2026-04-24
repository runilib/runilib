import { getAllDocEntries } from '@/lib/docs';
import { absoluteUrl } from '@/lib/site';

import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...getAllDocEntries().map((entry) => ({
      url: absoluteUrl(entry.href),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
