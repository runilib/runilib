import { siteConfig } from '@/lib/site';

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: 'formbridge docs',
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#08111a',
    theme_color: '#08111a',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
