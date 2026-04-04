import type { MetadataRoute } from 'next';
import { LIBRARIES } from '../data/libraries';

const BASE_URL = 'https://runilib.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/libraries`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/ecosystem`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contributing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const libraryPages: MetadataRoute.Sitemap = LIBRARIES.map((lib) => ({
    url: `${BASE_URL}/libraries/${lib.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticPages, ...libraryPages];
}
